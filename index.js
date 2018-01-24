const request = require('request');
var ConversationV1 = require('watson-developer-cloud/conversation/v1');
var prompt = require('prompt-sync')();

var conversation = new ConversationV1({
    username: 'c0403b48-2678-43ef-b0d6-dc91835b474c', // replace with username from service key
    password: 'tJwcW2j4f3VU', // replace with password from service key
    path: { workspace_id: '171556de-4e70-4ea8-88f0-edea73466888' }, // replace with workspace ID
    version_date: '2017-11-15'
  });

  let apiKey = '2b17ecca4daadb973a202d653862c011';
  let city = 'Portland';
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

  conversation.message({},processResponse);

  function processResponse(err,response){
      if(err){
          console.error(err);
          return;
      }
      if(response.output.text.length != 0){
          console.log(response.output.text[0]);
          if(response.intents.length > 0){
              if(response.intents[0].intent == 'Temperature'){
                  if(response.entities.length > 0){
                      let city = response.entities[0].value;
                      let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
                      request(url, function(err, response, body){
                        if(err){
                            console.log('error', error);
                        }
                        else{
                            let temperature = JSON.parse(body);
                            let message = `Its ${temperature.main.temp} degrees in ${temperature.name}!`;
                            console.log(message);
            
                            var newMessage = prompt('>> ');
                            conversation.message({
                                input:{text: newMessage}
                            },processResponse);
                        }
                      });
                  }
                  else{
                    var newMessage = prompt('>> ');
                    conversation.message({
                        input:{text: newMessage}
                    },processResponse);
                  }
              }
          }
          else{
            var newMessage = prompt('>> ');
            conversation.message({
                input:{text: newMessage}
            },processResponse);
          }
      }
  }