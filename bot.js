﻿const Discord = require('discord.js');
const fs = require("fs")
const request = require('request');
const config = require("./config.json");
const ytdl = require('ytdl-core');
const DBL = require("dblapi.js");








const client = new Discord.Client();
const prefix = "!"
const dbl = new DBL(config.dbl, client)



dbl.on('posted', () => {
  console.log('Server count posted!');
})

dbl.on('error', e => {
 console.log(`Oops! ${e}`);
})


/*
 * Add the following line event listener to your code to handle 'error' events properly:
 *
 * events.js:188
 *     throw err;
 *    ^
 *
 * Error: Unhandled "error" event. ([object Object])
 *   at Client.emit (events.js:186:19)
*/

client.on('error', console.error);


client.on("guildCreate", guild => {

	console.log("Some one added the bot to a server created by: " + guild.owner.user.username)

});


//Math functions
function kelToFar(kel){
  kel = parseFloat(kel);
  return ((kel * (9/5)) - 459.67).toString();
}

//Emoji weather resolver
function emoj(owi){
  if(owi == "01d" || owi == "01n"){ return ":sunny:"; }
  if(owi == "02d" || owi == "02n"){ return ":white_sun_small_cloud:"; }
  if(owi == "03d" || owi == "03n"){ return ":white_sun_cloud:"; }
  if(owi == "04d" || owi == "04n"){ return "<a:CloudySkies:462657771834441748>"; }
  if(owi == "09d" || owi == "09n"){ return "<a:RainShowers:462656999289520128>"; }
  if(owi == "10d" || owi == "10n"){ return "<a:RainShowers:462656999289520128>"; }
  if(owi == "11d" || owi == "11n"){ return "<a:ws4000tstorm:460496253554262016>"; }
  if(owi == "13d" || owi == "13n"){ return "<a:HeavySnow:462656222995415063>"; }
  if(owi == "50d" || owi == "50n"){ return ":fog:"; } //This is a custom emoji, you would have to add your own
}

//Unix time to normal
function realTime(unx){
  var mer = "AM";
  var date = new Date(unx*1000);
  var hours = date.getHours();
  if(hours > 12){
    hours = hours - 12;
    var mer = "PM";
  }
  var min = 0 + date.getMinutes();
  var sec = 0 + date.getSeconds();
  return hours+":"+min+":"+sec+" "+mer;
}



//Commands Array
var commands = [];

//on bot ready
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setStatus('online');
  client.user.setGame('your weather forecast. | !help')
});





//on bot message
client.on('message', (message) => {



  //Command handler
  function mainIn(string, array){
    var spli = string.split(" ");
    var x = array.findIndex(i => i.trigger === spli[0]+" ");
    if(array[x]){
      var obj = array[x];
      if(spli.length == obj.args){
        var regex = new RegExp("^"+obj.trigger+"", "gm");
        if(regex.test(string)){
          return obj.exec(spli[1], message);
        } else {
          return "Command trigger error";
        }
      } else {
        return "Wrong number of args in statment: given "+spli.length+", needed "+obj.args;
      }
    } else {
      comStrArray = [];
      commands.forEach(function(i){
        var nn = i.trigger;
        var nnn = nn.replace("!", "");
        var nnn = nnn.replace(" ", "");
        comStrArray.push(nnn);
      });
      return "Command not in command array: commands = ["+comStrArray.toString()+"]";
    }
  }

  //Commands

  var weather = {
	trigger: "!weather ",
    exec: function(q, message){
      var url = "http://api.openweathermap.org/data/2.5/weather?q="+q+"&APPID=5f7a3ebdd7c249e2afbbb8cec4368b1d"; //To Get AppID, go to https://openweathermap.org/appid
      request(url, function(e,r,b){
        var p = JSON.parse(b);
        console.log(p);
        if(p.main != undefined){
          console.log("Somebody requested the weather.");

        const embed = new Discord.RichEmbed()

        .setTitle("Here is your forecast " + message.author.username)

		.setColor(0x48E2EC)

		.setDescription("__**"+p.name+" Weather | "+Math.round(kelToFar(p.main.temp))+"°F "+emoj(p.weather[0].icon)+"**__ \n"+p.weather[0].main+" with a high of **"+Math.round(kelToFar(p.main.temp_max))+"°F** and a low of **"+Math.round(kelToFar(p.main.temp_min))+"°F** \nHumidity at **"+p.main.humidity+"%** and Atmospheric Pressure at **"+p.main.pressure+" hPa** \nWind speed **"+Math.round(p.wind.speed * 2.997446 * 100) / 100+" mph** from bearing **"+p.wind.deg+"°** \nSunrise **"+realTime(p.sys.sunrise)+"**, Sunset **"+realTime(p.sys.sunset)+"** \nMeasured at Longitude **"+p.coord.lon+"**, Latitude **"+p.coord.lat+"** \n*Powered by OpenWeatherMap <:openweathermap:460492652907986955>*")

		.setFooter("The number one simplest weather bot. 🌩");
          message.channel.send({embed})

        }

      });
    },
    args: 2
  }
  commands.push(weather);

  //Command Handle Listner
  mainIn(message.content, commands);

});

client.on("message", async (message) => {

	if (message.author.bot) return;

	if (!message.content.startsWith(prefix)) return;



	let command = message.content.split(" ")[0];

	command = command.slice(prefix.length);



	let args = message.content.split(" ").slice(1);



	if (command === "ping") {

		message.channel.send(`Pong! Time took: ${Date.now() - message.createdTimestamp} ms`);

	} else

    if (command === "about") {

		message.channel.send({embed: {
    color: 3447003,
    author: {
      name: client.user.username,
      icon_url: client.user.avatarURL
    },
    title: "Bot Information",
    url: "http://bot.discord.io/Skywarn",
    description: "This command provides information about the bot.",
    fields: [{
        name: "Author",
        value: "<@252084047264743428> - Skywarn Spotter [NWS/AKQ] | EAS Enthusiast | High School Sophomore"
      },
      {
        name: "What does this bot do?",
        value: "This bot was made for a user to retrieve the weather by using the `!weather` command."
      },
      {
        name: "Extra Things",
        value: "<:discordbot:497875313993449473> [Upvote](https://discordbots.org/bot/434112673072807936/vote) <:paypal:497876694485565440> [Donate](https://paypal.me/MarionStationEAS) <:support:497878801632460801> [Support me on Patreon](https://www.patreon.com/MarionStationEAS)"
      },
      {
        name: "Uptime",
        value: client.uptime
      }
    ],
    timestamp: new Date(),
    footer: {
      icon_url: client.user.avatarURL,
      text: "© MarionStationEAS Productions 2018"
    }
  }
});

	} else

	if (command === "eas") {

		const embed = new Discord.RichEmbed()

    .setTitle("What is the Emergency Alert System?")
    .setURL("https://www.fcc.gov/general/emergency-alert-system-eas")

    .setDescription("The Emergency Alert System (EAS) is a national public warning system that requires broadcasters, cable television systems, wireless cable systems, satellite digital audio radio service (SDARS) providers, and direct broadcast satellite (DBS) providers to provide the communications capability to the President to address the American public during a national emergency. The system also may be used by state and local authorities to deliver important emergency information, such as AMBER alerts and weather information targeted to specific areas.")

    .setImage("https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Eas_new.svg/1200px-Eas_new.svg.png")

    .setFooter("Source: FCC.gov");

    message.channel.send({embed})


	} else

	if (command === "invite") {

		message.channel.send(`Here you go: https://discordapp.com/api/oauth2/authorize?client_id=434112673072807936&permissions=536947712&scope=bot`);


	} else



	if (command === "say") {

		if(message.author.id !== config.ownerID) return;


		message.delete()

        const embed = new Discord.RichEmbed()

		.setColor(0x954D23)

		.setDescription(message.author.username + " says: " + args.join(" "));

		message.channel.send({embed})

	} else

  if (command === "upvote") {

    message.channel.send('Be sure to upvote the bot every 24 hours at https://discordbots.org/bot/434112673072807936/vote');

  } else



	if (command == "help") {

		const embed = new Discord.RichEmbed()

		.setColor(0x954D23)

		.setTitle("Command List:")

		.addField("!help", "Will give the current command list")

		.addField("!ping", "WIll show the ping time for the bot")

		.addField("!say [text]", "Will make the bot say something")

	     .addField("!weather <zip code>", "To do a city name you must do it the way i have it typed out or it will not work. <!weather baltimore,md,us> and cities with two words you must do this <!weather severna+park,md,us>")

		 .addField("!eas", "Displays information about The Emergency Alert System.")

		 .addField("!invite", "Displays invite link to invite the bot to a discord server.")

     .addField("!eas-test", "This is a test of the Emergency Alert System capibiality.")

     .addField("!upvote", "Displays link to upvote the bot.");

		message.channel.send({embed})

	}





});


//login bot
client.login(config.token);
