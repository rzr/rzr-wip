exec?=/usr/local/nginx/sbin/nginx

start: ${exec}
	$<

stop: ${exec}
	$< -s stop
