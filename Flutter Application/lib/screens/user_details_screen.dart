import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class UserDetailsScreen extends StatefulWidget {
  @override
  _UserDetailsScreenState createState() => _UserDetailsScreenState();
}

class _UserDetailsScreenState extends State<UserDetailsScreen> {
  final FlutterSecureStorage _secureStorage = FlutterSecureStorage();
  String? _walletBalance;
  List<dynamic> _ownedPokemon = [];
  String? _error;

  @override
  void initState() {
    super.initState();
    _fetchUserDetails();
  }

  Future<void> _fetchUserDetails() async {
    try {
      final token = await _secureStorage.read(key: 'userToken');

      if (token == null) {
        setState(() {
          _error = 'No token found. Please log in again.';
        });
        return;
      }

      final url = "http://192.168.26.172:8000/user/details";
      final response = await http.get(
        Uri.parse(url),
        headers: {
          "Authorization": "Bearer $token",
          "Content-Type": "application/json",
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          _walletBalance = data['wallet_balance'];
          _ownedPokemon = data['owned_pokemon'];
          _error = null;
        });
      } else {
        setState(() {
          _error = 'Error fetching user details: ${response.statusCode} ${response.reasonPhrase}';
        });
      }
    } catch (e) {
      setState(() {
        _error = 'Error fetching user details: $e';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('User Details'),
        backgroundColor: Colors.teal,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (_error != null)
              Text(
                _error!,
                style: TextStyle(color: Colors.red, fontSize: 16),
              ),
            if (_walletBalance != null) ...[
              Text(
                'Wallet Balance:',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
              ),
              SizedBox(height: 8),
              Text(
                '$_walletBalance ETH',
                style: TextStyle(fontSize: 16),
              ),
            ],
            if (_ownedPokemon.isNotEmpty) ...[
              SizedBox(height: 20),
              Text(
                'Owned Pokémon:',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
              ),
              SizedBox(height: 10),
              Expanded(
                child: ListView.builder(
                  itemCount: _ownedPokemon.length,
                  itemBuilder: (context, index) {
                    final pokemon = _ownedPokemon[index];
                    return _buildPokemonCard(pokemon);
                  },
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildPokemonCard(dynamic pokemon) {
    return Card(
      margin: EdgeInsets.symmetric(vertical: 8),
      elevation: 3,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      child: ListTile(
        leading: CircleAvatar(
          backgroundImage: NetworkImage(pokemon['nft_image_location'] ?? ''),
        ),
        title: Text(
          pokemon['pokemon_name'] ?? 'Unknown',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Text('Type: ${pokemon['pokemon_type'] ?? 'Unknown'}'),
      ),
    );
  }
}
