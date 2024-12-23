import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class LoginScreen extends StatelessWidget {
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  // Initialize Flutter Secure Storage
  final _secureStorage = FlutterSecureStorage();

  Future<void> loginUser(String email, String password, BuildContext context) async {
    final url = Uri.parse('http://192.168.218.68:8000/login');

    print("LoginUser function called");
    print("URL: $url");
    print("Email: $email, Password: $password");

    try {
      print("Sending POST request...");
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password}),
      );

      print("Response received.");
      print("Response Status Code: ${response.statusCode}");
      print("Response Body: ${response.body}");

      if (response.statusCode == 201) {
        print("Status code is 201. Parsing response...");
        final responseData = jsonDecode(response.body);

        if (responseData['success'] == 'Login Completed' &&
            responseData['user'] != null &&
            responseData['userToken'] != null) {
          print("Response contains success, user, and userToken.");

          // Save token securely
          await _secureStorage.write(key: 'userToken', value: responseData['userToken']);
          print("Saved userToken securely: ${responseData['userToken']}");

          // Verify saved token
          final savedToken = await _secureStorage.read(key: 'userToken');
          print("Retrieved userToken after saving: $savedToken");

          print("Login successful. Navigating to Home Screen...");
          Navigator.pushReplacementNamed(context, '/');
        } else {
          print("Invalid response format or missing fields.");
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Unexpected response format.')),
          );
        }
      } else {
        print("Login failed. Status code: ${response.statusCode}");
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Login failed. Please check your credentials.')),
        );
      }
    } catch (error) {
      print("Error during login: $error");
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('An error occurred. Please try again later.')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Pokémon Game Login'),
        backgroundColor: Colors.redAccent,
      ),
      body: Center(
        child: SingleChildScrollView(
          padding: EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Image.asset(
                'assets/images/pokeball.png', // Replace with your asset path
                height: 100,
                width: 100,
              ),
              SizedBox(height: 20),
              Text(
                'Trainer Login',
                style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.redAccent),
              ),
              SizedBox(height: 10),
              Text(
                'Welcome back, Trainer! Log in to access your Pokémon.',
                style: TextStyle(fontSize: 16, color: Colors.grey),
                textAlign: TextAlign.center,
              ),
              SizedBox(height: 30),
              TextField(
                controller: emailController,
                decoration: InputDecoration(
                  labelText: 'Email',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.email, color: Colors.redAccent),
                ),
              ),
              SizedBox(height: 20),
              TextField(
                controller: passwordController,
                obscureText: true,
                decoration: InputDecoration(
                  labelText: 'Password',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.lock, color: Colors.redAccent),
                ),
              ),
              SizedBox(height: 20),
              ElevatedButton(
                onPressed: () {
                  final email = emailController.text;
                  final password = passwordController.text;

                  if (email.isNotEmpty && password.isNotEmpty) {
                    loginUser(email, password, context);
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Please enter both email and password.')),
                    );
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.redAccent,
                  minimumSize: Size(double.infinity, 50),
                ),
                child: Text('Login', style: TextStyle(fontSize: 18)),
              ),
              SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    "Don't have an account?",
                    style: TextStyle(fontSize: 16, color: Colors.grey),
                  ),
                  TextButton(
                    onPressed: () {
                      Navigator.pushNamed(context, '/signup');
                    },
                    child: Text('Sign up', style: TextStyle(fontSize: 16, color: Colors.redAccent)),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
