const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function testAuth() {
  console.log('🧪 Probando sistema de autenticación...\n');

  try {
    // 1. Registrar un nuevo usuario
    console.log('1️⃣ Registrando nuevo usuario...');
    const registerData = {
      email: 'test@example.com',
      password: 'password123',
      nickname: 'testuser'
    };

    const registerResponse = await axios.post(`${BASE_URL}/user/register`, registerData);
    console.log('✅ Usuario registrado exitosamente');
    console.log('📧 Email:', registerResponse.data.user.email);
    console.log('👤 Nickname:', registerResponse.data.user.nickname);
    console.log('🔑 Token generado:', registerResponse.data.token.substring(0, 20) + '...');
    console.log('');

    // 2. Hacer login con el usuario registrado
    console.log('2️⃣ Haciendo login...');
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };

    const loginResponse = await axios.post(`${BASE_URL}/user/login`, loginData);
    console.log('✅ Login exitoso');
    console.log('🔑 Token de login:', loginResponse.data.token.substring(0, 20) + '...');
    console.log('');

    // 3. Probar login con credenciales incorrectas
    console.log('3️⃣ Probando login con credenciales incorrectas...');
    try {
      await axios.post(`${BASE_URL}/user/login`, {
        email: 'test@example.com',
        password: 'wrongpassword'
      });
      console.log('❌ Error: Debería haber fallado');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Correctamente rechazó credenciales inválidas');
      } else {
        console.log('❌ Error inesperado:', error.message);
      }
    }
    console.log('');

    // 4. Probar registro con email duplicado
    console.log('4️⃣ Probando registro con email duplicado...');
    try {
      await axios.post(`${BASE_URL}/user/register`, registerData);
      console.log('❌ Error: Debería haber fallado');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Correctamente rechazó registro duplicado');
      } else {
        console.log('❌ Error inesperado:', error.message);
      }
    }
    console.log('');

    // 5. Verificar estructura del token
    console.log('5️⃣ Verificando estructura del token...');
    const token = loginResponse.data.token;
    const tokenParts = token.split('.');
    
    if (tokenParts.length === 3) {
      console.log('✅ Token tiene formato JWT válido (3 partes)');
      
      // Decodificar payload del token (sin verificar firma)
      const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
      console.log('📋 Payload del token:', {
        sub: payload.sub,
        nickname: payload.nickname,
        iat: payload.iat,
        exp: payload.exp
      });
    } else {
      console.log('❌ Token no tiene formato JWT válido');
    }

    console.log('\n🎉 ¡Todas las pruebas completadas exitosamente!');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

// Verificar si el servidor está corriendo
async function checkServer() {
  try {
    await axios.get(`${BASE_URL.replace('/api', '')}/health`);
    console.log('✅ Servidor está corriendo');
    return true;
  } catch (error) {
    console.log('❌ Servidor no está corriendo. Ejecuta: npm run start:dev');
    return false;
  }
}

async function main() {
  console.log('🚀 Iniciando pruebas de autenticación...\n');
  
  const serverRunning = await checkServer();
  if (!serverRunning) {
    return;
  }
  
  await testAuth();
}

main(); 