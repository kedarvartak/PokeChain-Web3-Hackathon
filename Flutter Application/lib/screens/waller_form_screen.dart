import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class WalletFormScreen extends StatefulWidget {
  @override
  _WalletFormScreenState createState() => _WalletFormScreenState();
}

class _WalletFormScreenState extends State<WalletFormScreen> {
  String? _walletDetails;
  List<dynamic> _ownedPokemon = [];
  String? _error;
  bool _isLoading = false;

  Future<void> _fetchWalletDetails() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      // Hardcoded URL and token
      final url =
          "http://192.168.218.68:8000/eth?userToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3YWxsZXRfYWRkcmVzcyI6IjB4RjM5ODI3MDgxOTUxQjFiOEI5ODk2MDkyNTJGREUyMDMzMzBjQjBlMSIsImVtYWlsIjoia2VkYXJ2YXJ0YWsyMkB2aXQuZWR1IiwiaWF0IjoxNzM0ODMxODg0LCJleHAiOjE3MzU0MzY2ODR9.6NwukLUdX1KhPsGWQMWYxMT6ZaCJ1z_Sj6nuAe19Elc";
      print('Fetching wallet details from: $url');

      // Make GET request
      final response = await http.get(Uri.parse(url));

      if (response.statusCode == 200) {
        // Parse response
        final data = jsonDecode(response.body);
        print('Response Data: $data');

        setState(() {
          _walletDetails = '''
Wallet Address: ${data['address']}
Balance: ${data['balance']} ETH
NFTs Owned: ${data['nfts'].length}
''';
          _ownedPokemon = data['nfts'];
          _isLoading = false;
        });
      } else {
        print('Error: ${response.statusCode} ${response.reasonPhrase}');
        setState(() {
          _error = 'Error fetching wallet details: ${response.statusCode} ${response.reasonPhrase}';
          _isLoading = false;
        });
      }
    } catch (e) {
      print("Error fetching wallet details: $e");
      setState(() {
        _error = 'Error fetching wallet details: $e';
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Wallet Details'),
        backgroundColor: Colors.teal,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ElevatedButton(
              onPressed: _fetchWalletDetails,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.teal,
                minimumSize: Size(double.infinity, 50),
              ),
              child: _isLoading
                  ? SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                        color: Colors.white,
                        strokeWidth: 2,
                      ),
                    )
                  : Text('Fetch Wallet Details', style: TextStyle(fontSize: 18)),
            ),
            SizedBox(height: 20),
            if (_error != null)
              Text(
                _error!,
                style: TextStyle(color: Colors.red, fontSize: 16),
              ),
            if (_walletDetails != null)
              Container(
                width: double.infinity,
                padding: EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.grey[200],
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.black, width: 1),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Wallet Details:',
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                    ),
                    SizedBox(height: 8),
                    Text(
                      _walletDetails!,
                      style: TextStyle(fontSize: 16),
                    ),
                  ],
                ),
              ),
            if (_ownedPokemon.isNotEmpty) ...[
              SizedBox(height: 20),
              Text(
                'Owned Pokémon:',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
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
          backgroundImage: NetworkImage(
            "http://192.168.218.68:5000${pokemon['nft_image_location']}", // Append base URL if required
          ),
        ),
        title: Text(
          pokemon['pokemon_name'],    
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Text('Type: ${pokemon['pokemon_type']}'),
      ),
    );
  }
}
