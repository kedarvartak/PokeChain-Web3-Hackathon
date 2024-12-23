import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorageService {
  final FlutterSecureStorage _secureStorage = FlutterSecureStorage();

  Future<void> saveToken(String token) async {
    await _secureStorage.write(key: 'userToken', value: token);
  }

  Future<String?> getToken() async {
    return await _secureStorage.read(key: 'userToken');
  }

  Future<void> deleteToken() async {
    await _secureStorage.delete(key: 'userToken');
  }
}
