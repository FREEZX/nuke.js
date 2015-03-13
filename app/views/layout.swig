<!DOCTYPE html>
<html>
<head>
  <title>{{appName}}</title>
  <link rel="shortcut icon" href="/favicon.ico?v=3" />
  {% for css in assets.css %}
    <link rel="stylesheet" type="text/css" href="{% if css|isCdn %}{{cdnBase}}{% endif %}{{css}}" />
  {% endfor %}
</head>
<body>
  {% block content %}
  {% endblock %}
  {% for js in assets.js %}
    <script type="text/javascript" src="{% if js|isCdn %}{{cdnBase}}{% endif %}{{js}}" defer></script>
  {% endfor %}
</body>
</html>
