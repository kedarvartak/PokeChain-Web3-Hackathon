import 'package:flutter/material.dart';
import 'package:pokechainhelper/screens/contact_us_screen.dart';
import 'package:pokechainhelper/screens/user_details_screen.dart';
import 'package:pokechainhelper/screens/waller_form_screen.dart';
import 'package:pokechainhelper/screens/wallet_connection_screen.dart';
import 'package:pokechainhelper/screens/signup_screen.dart';
import 'package:pokechainhelper/screens/login_screen.dart'; // Import Login Screen
import 'providers/pokemon_provider.dart';
import 'providers/guide_provider.dart';
import 'screens/home_screen.dart';
import 'screens/pokemon_cards_screen.dart';
import 'screens/guide_screen.dart';
import 'screens/stats_screen.dart';
import 'package:provider/provider.dart';

void main() {
  runApp(PokeChainHelperApp());
}

class PokeChainHelperApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => PokemonProvider()),
        ChangeNotifierProvider(create: (_) => GuideProvider()),
      ],
      child: MaterialApp(
        title: 'PokeChain Helper',
        theme: ThemeData(
          primarySwatch: Colors.blue,
        ),
        debugShowCheckedModeBanner: false,
        initialRoute: '/login', // Set LoginScreen as the initial screen
        routes: {
          '/': (context) => HomeScreen(), // Home Screen
          '/login': (context) => LoginScreen(), // Login Screen
          '/signup': (context) => SignupScreen(),
          '/pokemon_cards': (context) => PokemonCardsScreen(),
          '/guide': (context) => GuideScreen(),
          '/stats': (context) => StatsScreen(),
          '/wallet': (context) => WalletFormScreen(),
          '/connect_wallet': (context) => WalletConnectionScreen(),
          '/contact_us': (context) => ContactUsScreen(),
          '/user_details': (context) => UserDetailsScreen(),
        },
      ),
    );
  }
}
