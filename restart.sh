if ! sudo lsof -i tcp:3000 | grep LISTEN || ! sudo lsof -i tcp:5000 | grep LISTEN
then
	kill $(pidof node)
	cd /home/ubuntu/simplepoint/frontend && sudo pm2 stop frontend && sudo pm2 delete frontend && sudo pm2 start --name frontend npm -- start
	cd /home/ubuntu/simplepoint/chat-server && sudo pm2 stop chat && sudo pm2 delete chat && sudo pm2 start --name chat npm -- start
fi
