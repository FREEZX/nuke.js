<!DOCTYPE html>
<html>
<head>
	<title>REMP App</title>
	<link rel="shortcut icon" href="/favicon.ico" />
	{% for css in assets.css %}
		<link rel="stylesheet" type="text/css" href="{{css}}" />
	{% endfor %}
</head>
<body>
	{% block content %}
	{% for js in assets.js %}
		<script type="text/javascript" src="{{js}}" />
	{% endfor %}
</body>
</html>