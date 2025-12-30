var url_prefix = "https://geoblinker.ru/taxi/c/Assist/api/v1/"; 
var user = {
 "login": "логин", 
 "password": "пароль", 
 "type": "e-mail" 
};
var user_token = "значение токена"; 
var user_u_hash = "значение хеша"; 
function encode_data(obj){ 
 var data = []; 
 for (var key in obj){ 
  data.push(encodeURIComponent(key)+"="+encodeURIComponent(obj[key]));  
 } 
 data = data.join("&"); 
 return data; 
}

//Авторизация и получение токена юзером:
var req = new XMLHttpRequest(); 
req.open('POST', url_prefix + "auth", false);
req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
var post_obj = { 
 "login": user.login, 
 "password": user.password, 
 "type":  user.type
} 
req.send(encode_data(post_obj));
var auth_hash = JSON.parse(req.response).auth_hash;
req = new XMLHttpRequest();
req.open('POST', url_prefix + "token", false);
req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
var post_obj = {"auth_hash": auth_hash};
req.send(encode_data(post_obj));
user_token = JSON.parse(req.response).data.token;
user_u_hash = JSON.parse(req.response).data.u_hash;

//Регистрация клиента админом
req = new XMLHttpRequest(); 
req.open('GET', url_prefix + "register", false); 
req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); 
var post_obj = { 
 "token": user_token, 
 "u_hash": user_u_hash, 
 "u_name": "Имя Отчество Фамилия",
 "u_phone": "телефон пользователя",
 "u_email": "емейл пользователя",
 "u_role":"1", 
 "st":"",
 "data": JSON.stringify({ 
  "u_details":{/*дополнительные параметры*/},
  "password":"пароль"
 });
}; 
req.send(encode_data(post_obj)); 
client_token = JSON.parse(req.response).data.token; 
client_u_hash = JSON.parse(req.response).data.u_hash; 
var client_id = JSON.parse(req.response).data.u_id; 
var client_password = JSON.parse(req.response).data.string;//если не указан емейл и не указан password

//Получение данных о юзерах
var url = url_prefix + "user/u_id1,u_id2";
var url = url_prefix + "authorized";
req = new XMLHttpRequest(); 
req.open('GET', url, false); 
req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); 
var post_obj = {
 "token": user_token, 
 "u_hash": user_u_hash
}; 
req.send(encode_data(post_obj)); 
var u_details = JSON.parse(req.response).data[id].u_details;

//Редактирование юзера
var url = url_prefix + "user/id";
var url = url_prefix + "user";
req = new XMLHttpRequest(); 
req.open('GET', url, false); 
req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); 
var post_obj = {
 "token": user_token, 
 "u_hash": user_u_hash,
 "data": JSON.stringify({ 
  "u_details":[...],
  "u_role":"идентификатор роли пользователя",
  "u_name":"имя пользователя",
  "u_family":"фамилия пользователя",
  "u_middle":"отчество пользователя",
  "u_phone":"телефон пользователя или null",
  "u_email":"емейл пользователя или null",	
  "u_check_state":"идентификатор верификации пользователя или null, data.user_check_states"
 });
}; 
req.send(encode_data(post_obj));
/*
для юзера, который будет исполнителем, u_check_state должно быть 2
*/

/*
Параметр u_details должены быть массивом:
	[
		["=",["ключ1","ключ2","ключ3","ключ4",...],архив|строка|число|NULL],
		["+",["ключ1","ключ2","ключ3","ключ4",...],архив|строка|число|NULL],
		["-",["ключ1","ключ2","ключ3","ключ4",...]]				
	]
Последовательность ключей
	["ключ1","ключ2","ключ3","ключ4"]
определяет элемент
	u_details["ключ1"]["ключ2"]["ключ3"]["ключ4"]
В зависимости от оператора производятся разные действия над указанным элементом:
	=			значение приравнивается второму элеиенту
	+			к значению довабляется второй элемент
	-			удаляется указанный элемент
Ключи полученного для "=" и "+" значения проверяются в зависимости от константы data.site_constants.u_details_valid_keys.
*/

//Получение констант
req = new XMLHttpRequest(); 
req.open('GET', url_prefix + "data", false); 
req.send(); 
var cities = JSON.parse(req.response).data.data.site_constants; 

//Создание или редактирование констант админом
req = new XMLHttpRequest(); 
req.open('POST', url_prefix + "data", false); 
req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); 
var post_obj = { 
 "token": user_token, 
 "u_hash": user_hash, 
 "data": JSON.stringify({
	"site_constants":[{
		"id": "название константы",						//необязательно; если не существует, создается константа с таким названием, иначе редактируется	
		"group": "идентификатор категории",
		"ru":	"название на русском",					//необязательно; дефолт null; уникальное
		"en":	"название на английском",				//необязательно; дефолт null; уникальное
		"ar":	"название на арабском",					//необязательно; дефолт null; уникальное
		"fr":	"название на французком",				//необязательно; дефолт null; уникальное
		"es":	"название на испанском",				//необязательно; дефолт null; уникальное
		"about_ru":	"описание на русском",				//необязательно; дефолт пустая строка
		"about_en":	"описание на английском",			//необязательно; дефолт пустая строка
		"about_ar":	"описание на арабском",				//необязательно; дефолт пустая строка
		"about_fr":	"описание на французком",			//необязательно; дефолт пустая строка
		"about_es":	"описание на испанском",			//необязательно; дефолт пустая строка
		"value": "значение константы",
		"active":	"0 или 1"							//необязательно; дефолт 1
	}]
  }); 
}
req.send(encode_data(post_obj));

//Создание записи админом
req = new XMLHttpRequest(); 
req.open('POST', url_prefix + "drive", false);
req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); 
var post_obj = { 
	"token": user_token, 
	"u_hash": user_u_hash,
	"data": JSON.stringify({
		"b_start_address":"адрес",
		"b_start_datetime":"any|now|год-месяц-день час:минуты:секунды±часы:минуты",
		"b_payment_way":"2",
		"b_options":{...},	//архив параметров
		"u_id":"идентификатор клиента"
	})
}; 
req.send(encode_data(post_obj));
var b_id = JSON.parse(req.response).data.b_id; 
/*
регулярное выражение для проверки времени
^([0-9]{4}-[0-9]{1,2}-[0-9]{1,2})\s+([0-9]{1,2}\:[0-9]{1,2}\:[0-9]{1,2})\s*((?:\+|-)[0-9]{2}\:[0-9]{2})$
*/

//Назначение исполнителя:
req = new XMLHttpRequest(); 
req.open('POST', url_prefix + "drive/get/" + b_id, false);
req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); 
var post_obj = { 
	"token": user_token, 
	"u_hash": user_u_hash,
	"u_a_role": 2,
	"performer": 1,
	"action": "set_performer"
	"data": JSON.stringify({
		"c_id":"id кабинета",	//необходимо
		"c_payment_way":2,
		"c_options":{...}	//архив параметров
	})
}; 
req.send(encode_data(post_obj));

//Получение активных записей клиента админом:
req = new XMLHttpRequest(); 
req.open('POST', url_prefix + "drive", false); 
req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); 
var post_obj = { 
	"token": user_token, 
	"u_hash": user_u_hash,
	"u_a_role": 1,
	"u_a_id": "идентификатор клиента"
	
}; 
req.send(encode_data(post_obj));

//Получение активных записей исполнителя:
req = new XMLHttpRequest(); 
req.open('POST', url_prefix + "drive", false); 
req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); 
var post_obj = { 
	"token": user_token, 
	"u_hash": user_u_hash,
	"u_a_role": 2
}; 
req.send(encode_data(post_obj)); 

//Редактирование записи от клиента админом:
req = new XMLHttpRequest(); 
req.open('POST', url_prefix + "drive/get/" + b_id, false);
req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); 
var post_obj = { 
	"token": user_token, 
	"u_hash": user_u_hash,
	"u_a_role": 1,
	"u_a_id": "идентификатор клиента",
	"action": "edit",
	"data": JSON.stringify({"b_options":[
		["=",["ключ1"],"значение1"],		
		["=",["ключ2"],"значение2"],				
	]}); 
}; 
req.send(encode_data(post_obj));
 
//Редактирование записи от исполнителя:
req = new XMLHttpRequest(); 
req.open('POST', url_prefix + "drive/get/" + b_id, false);
req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); 
var post_obj = { 
	"token": user_token, 
	"u_hash": user_u_hash,
	"u_a_role": 2,
	"action": "edit",
	"data": JSON.stringify({"c_options":[
		["=",["ключ1"],"значение1"],		
		["=",["ключ2"],"значение2"],				
	]}); 
}; 
req.send(encode_data(post_obj));

//Завершение записи исполнителем:
req = new XMLHttpRequest(); 
req.open('POST', url_prefix + "drive/get/" + b_id, false);
req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); 
var post_obj = { 
	"token": user_token, 
	"u_hash": user_u_hash,
	"u_a_role": 2,
	"action": "set_complete_state"
};


//Получение архивных записей клиента админом:
req = new XMLHttpRequest(); 
req.open('POST', url_prefix + "drive/archive", false); 
req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); 
var post_obj = { 
	"token": user_token, 
	"u_hash": user_u_hash,
	"u_a_role": 1,
	"u_a_id": "идентификатор клиента"
	
}; 
req.send(encode_data(post_obj));

//Получение архивных записей исполнителя:
req = new XMLHttpRequest(); 
req.open('POST', url_prefix + "drive/archive", false); 
req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); 
var post_obj = { 
	"token": user_token, 
	"u_hash": user_u_hash,
	"u_a_role": 2
}; 
req.send(encode_data(post_obj));

//Создание кабинета:
req = new XMLHttpRequest(); 
req.open('POST', url_prefix + "car", false); 
req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); 
var post_obj = { 
	"token": user_token, 
	"u_hash": user_u_hash,
	"u_a_role": 2,
	"data": JSON.stringify({ 
		"registration_plate":"номер кабинета"
	}); 
}; 
req.send(encode_data(post_obj)); 
var c_id = JSON.parse(req.response).data.cteated_car.c_id;
var u_id = JSON.parse(req.response).data.cteated_car.u_id;

//Присвоение кабинета юзерам u_id1,u_id2:
req = new XMLHttpRequest(); 
req.open('POST', url_prefix + "user/u_id1,u_id2/car/c_id", false); 
req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); 
var post_obj = { 
	"token": user_token, 
	"u_hash": user_u_hash,
	"u_a_role": 2
}; 
req.send(encode_data(post_obj)); 