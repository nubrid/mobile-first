set OPENSSL_CONF=%~dp0\openssl\openssl.cnf

IF "%~x1" == ".key" .\openssl\bin\openssl rsa -in %1 -outform der -pubout | .\openssl\bin\openssl dgst -sha256 -binary | .\openssl\bin\openssl enc -base64
IF "%~x1" == ".csr" .\openssl\bin\openssl req -in %1 -pubkey -noout | .\openssl\bin\openssl rsa -pubin -outform der | .\openssl\bin\openssl dgst -sha256 -binary | .\openssl\bin\openssl enc -base64
IF "%~x1" == ".crt" .\openssl\bin\openssl x509 -in %1 -pubkey -noout | .\openssl\bin\openssl rsa -pubin -outform der | .\openssl\bin\openssl dgst -sha256 -binary | .\openssl\bin\openssl enc -base64

set OPENSSL_CONF=
pause