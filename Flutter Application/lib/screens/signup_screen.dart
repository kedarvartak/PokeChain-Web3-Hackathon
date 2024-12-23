import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class SignupScreen extends StatelessWidget {
  final TextEditingController walletController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  Future<void> signupUser(String walletAddress, String email, String password) async {
    final url = Uri.parse('http://192.168.218.68:8000/signup');
    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'wallet_address': walletAddress,
          'email': email,
          'password': password,
        }),
      );

      if (response.statusCode == 201) {
        final responseData = jsonDecode(response.body);

        // Save token and user details for future use
        SharedPreferences prefs = await SharedPreferences.getInstance();
        await prefs.setString('userToken', responseData['userToken']);
        await prefs.setString('walletAddress', responseData['user']['wallet_address']);
        await prefs.setString('email', responseData['user']['email']);

        print('Signup successful: ${responseData['success']}');
      } else {
        print('Signup failed with status code: ${response.statusCode}');
      }
    } catch (error) {
      print('Error during signup: $error');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Signup')),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: walletController,
              decoration: InputDecoration(labelText: 'Wallet Address'),
            ),
            TextField(
              controller: emailController,
              decoration: InputDecoration(labelText: 'Email'),
            ),
            TextField(
              controller: passwordController,
              obscureText: true,
              decoration: InputDecoration(labelText: 'Password'),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                final wallet = walletController.text;
                final email = emailController.text;
                final password = passwordController.text;

                signupUser(wallet, email, password).then((_) {
                  // Navigate to Login or Home Screen after successful signup
                  Navigator.pushNamed(context, '/login');
                });
              },
              child: Text('Signup'),
            ),
          ],
        ),
      ),
    );
  }
}
