// test-hash.js
import bcrypt from 'bcrypt';

const testPassword = async () => {
  const password = '123456';
  
  // 生成新的雜湊
  const hash = await bcrypt.hash(password, 10);
  console.log('New hash:', hash);
  
  // 測試驗證
  const isValid = await bcrypt.compare(password, hash);
  console.log('Validation test:', isValid);
  
  // 測試與資料庫中的雜湊比對
  const dbHash = '$2b$10$GJFaF6yZg9TqPxMQVAIV7.AHkGrWG.9BKBPBW9tYi5YmF6PeY5Jf6';
  const isValidWithDb = await bcrypt.compare(password, dbHash);
  console.log('Validation with DB hash:', isValidWithDb);
};

testPassword();