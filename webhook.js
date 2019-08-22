const WebOptions = {
	webHook: {
	  // Port to which you should bind is assigned to $PORT variable
	  // See: https://devcenter.heroku.com/articles/dynos#local-environment-variables
	  port: process.env.PORT || '3000'
	  // you do NOT need to set up certificates since Heroku provides
	  // the SSL certs already (https://<app-name>.herokuapp.com)
	  // Also no need to pass IP because on Heroku you need to bind to 0.0.0.0
	}
  };
  // Heroku routes from port :443 to $PORT
  // Add URL of your app to env variable or enable Dyno Metadata
  // to get this automatically
  // See: https://devcenter.heroku.com/articles/dyno-metadata
const WebHookUrl = process.env.APP_URL ||  'https://retrogamesbot.herokuapp.com'; //HEROKU WEBHOOK
'https://1f3fdf9d.ngrok.io' //NGROK WEBHOOK
const TOKEN = process.env.TELEGRAM_TOKEN || '802150654:AAFx1hczbT2x31udxP_xfvQQ2bw9kCRsZ00'; //TOKEN @RETROGAMES_BOT
'458733904:AAH-Fq8ABp5xVpLHf32uxKAbP-nMCLf4mgU' //TOKEN BERTINNN_BOT


module.exports = {
    TOKEN, WebOptions, WebHookUrl
}