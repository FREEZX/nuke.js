<!DOCTYPE html>
<html>
<head>
	<title>{{appName}}</title>
	<link rel="shortcut icon" href="/favicon.ico?v=3" />
	{% for css in assets.css %}
		<link rel="stylesheet" type="text/css" href="{% if css|isCdn %}{{cdn_base}}{% endif %}{{css}}" />
	{% endfor %}
</head>
<body>
	{% block content %}
	{% endblock %}
	{% for js in assets.js %}
		<script type="text/javascript" src="{% if js|isCdn %}{{cdn_base}}{% endif %}{{js}}" defer></script>
	{% endfor %}
</body>
</html>