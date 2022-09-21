set OPENSSL_CONF=%~dp0\openssl\openssl.cnf
.\openssl\bin\openssl genrsa -des3 -out %1.key 1024
.\openssl\bin\openssl req -new -key %1.key -out %1.csr
copy %1.key %1.key.org
.\openssl\bin\openssl rsa -in %1.key.org -out %1.key
.\openssl\bin\openssl x509 -req -days 365 -in %1.csr -signkey %1.key -out %1.crt
set OPENSSL_CONF=
pause