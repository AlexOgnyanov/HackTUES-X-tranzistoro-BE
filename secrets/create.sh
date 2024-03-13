openssl req -x509 -nodes -days 730 -newkey rsa:2048 -keyout private-key.pem -out public-certificate.pem -config san.cnf

#openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout private-key.pem -out public-certificate.pem -addext "subjectAltName = DNS:localhost"