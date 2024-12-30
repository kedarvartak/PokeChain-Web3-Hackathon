import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class WalletConnectionScreen extends StatefulWidget {
  @override
  _WalletConnectionScreenState createState() => _WalletConnectionScreenState();
}

class _WalletConnectionScreenState extends State<WalletConnectionScreen> {
  final TextEditingController _walletController = TextEditingController();
  String? _walletAddress;
  String? _walletBalance;
  String? _error;
  List<Map<String, dynamic>> _nfts = [];
  bool _isLoading = false; // Loading state

  final String rpcUrl = "https://rpc.sepolia.linea.build"; // RPC URL

  Future<void> _connectWallet() async {
    final address = _walletController.text.trim();

    if (address.isEmpty || !RegExp(r"^0x[a-fA-F0-9]{40}$").hasMatch(address)) {
      setState(() {
        _error = 'Please enter a valid wallet address.';
        _walletBalance = null;
        _walletAddress = null;
        _nfts = [];
      });
      return;
    }

    setState(() {
      _isLoading = true; // Start loading
      _error = null; // Clear previous errors
      _walletBalance = null;
      _walletAddress = null;
      _nfts = [];
    });

    try {
      // Fetch ETH balance
      final balancePayload = {
        "jsonrpc": "2.0",
        "method": "eth_getBalance",
        "params": [address, "latest"],
        "id": 1,
      };

      final balanceResponse = await http.post(
        Uri.parse(rpcUrl),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode(balancePayload),
      );

      if (balanceResponse.statusCode == 200) {
        final balanceData = jsonDecode(balanceResponse.body);
        final balanceInWei = BigInt.parse(balanceData['result'].substring(2), radix: 16);
        final ethBalance = balanceInWei / BigInt.from(10).pow(18);

        setState(() {
          _walletAddress = address;
          _walletBalance = ethBalance.toStringAsFixed(4) + " ETH";
        });
      } else {
        throw Exception('Failed to fetch ETH balance.');
      }

      // Simulate NFT fetch
      await Future.delayed(Duration(seconds: 2)); // Simulating delay
      setState(() {
        _nfts = [
          {
            "pokemon_id": 4,
            "pokemon_name": "Charmander",
            "pokemon_type": "Fire",
            "nft_image_location":
                "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png",
          }
        ];
      });
    } catch (e) {
      setState(() {
        _error = 'Error connecting to wallet: $e';
      });
    } finally {
      setState(() {
        _isLoading = false; // Stop loading
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Connect Wallet'),
        backgroundColor: Colors.teal,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Enter Wallet Address',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 10),
            TextField(
              controller: _walletController,
              decoration: InputDecoration(
                border: OutlineInputBorder(),
                labelText: 'Wallet Address',
                hintText: 'Enter your wallet address',
              ),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: _connectWallet,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.teal,
                foregroundColor: Colors.white,
              ),
              child: Text('Connect'),
            ),
            SizedBox(height: 20),
            if (_isLoading)
              Center(child: CircularProgressIndicator()), // Show loading indicator
            if (_error != null)
              Text(
                _error!,
                style: TextStyle(color: Colors.red),
              ),
            if (_walletAddress != null)
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Wallet Address: $_walletAddress',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 10),
                  Text(
                    'Balance: $_walletBalance',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
            if (!_isLoading && _nfts.isNotEmpty) ...[
              SizedBox(height: 20),
              Text(
                'Owned NFTs:',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 10),
              Expanded(
                child: ListView.builder(
                  itemCount: _nfts.length,
                  itemBuilder: (context, index) {
                    final nft = _nfts[index];
                    return Card(
                      margin: EdgeInsets.symmetric(vertical: 8),
                      elevation: 5,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(15),
                      ),
                      child: ListTile(
                        leading: Image.network(
                          nft['nft_image_location'],
                          height: 50,
                          width: 50,
                          fit: BoxFit.cover,
                        ),
                        title: Text(nft['pokemon_name']),
                        subtitle: Text('Type: ${nft['pokemon_type']}'),
                      ),
                    );
                  },
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
