// components/Footer.js
import { motion } from 'framer-motion';
import { 
  DiscordIcon, 
  TwitterIcon, 
  GithubIcon, 
  TelegramIcon 
} from './Social';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'FEATURES', href: '#' },
      { name: 'MARKETPLACE', href: '#' },
      { name: 'STAKING', href: '#' },
      { name: 'ROADMAP', href: '#' },
    ],
    support: [
      { name: 'DOCUMENTATION', href: '#' },
      { name: 'GUIDES', href: '#' },
      { name: 'FAQ', href: '#' },
      { name: 'HELP CENTER', href: '#' },
    ],
    legal: [
      { name: 'PRIVACY POLICY', href: '#' },
      { name: 'TERMS OF SERVICE', href: '#' },
      { name: 'COOKIE POLICY', href: '#' },
    ],
  };

  const socialLinks = [
    { name: 'Discord', icon: <DiscordIcon />, href: '#', color: 'bg-[#FF6B6B]' },
    { name: 'Twitter', icon: <TwitterIcon />, href: '#', color: 'bg-[#4ECDC4]' },
    { name: 'GitHub', icon: <GithubIcon />, href: '#', color: 'bg-[#FFD93D]' },
    { name: 'Telegram', icon: <TelegramIcon />, href: '#', color: 'bg-[#FF6B6B]' },
  ];

  return (
    <footer className="bg-[#FFF3E4] border-t-4 border-black mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div 
              whileHover={{ rotate: -2, scale: 1.05 }}
              className="flex items-center mb-6 bg-[#FFD93D] p-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] inline-block"
            >
              <span className="text-3xl mr-2">🔥</span>
              <h2 className="text-2xl font-black">POKECHAIN</h2>
            </motion.div>
            <p className="text-black font-bold text-lg mb-6 bg-white p-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              Train your Pokemon, earn tokens, and become the ultimate trainer in the blockchain world!
            </p>
            {/* Social Links */}
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ rotate: -4, scale: 1.1 }}
                  className={`p-3 ${social.color} text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]`}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {['product', 'support', 'legal'].map((section) => (
            <div key={section} className="bg-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-xl font-black mb-6 uppercase bg-[#4ECDC4] p-2 border-4 border-black inline-block">
                {section}
              </h3>
              <ul className="space-y-4">
                {footerLinks[section].map((link) => (
                  <motion.li 
                    key={link.name} 
                    whileHover={{ x: 8 }}
                    className="font-bold"
                  >
                    <a href={link.href} className="hover:text-[#FF6B6B] transition-colors">
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="bg-[#4ECDC4] border-4 border-black p-8 mb-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-2xl font-black mb-6">STAY UP TO DATE!</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="ENTER YOUR EMAIL"
              className="flex-1 p-4 border-4 border-black font-bold placeholder-black/70 focus:outline-none focus:border-[#FF6B6B] bg-white"
            />
            <motion.button
              whileHover={{ rotate: 2, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-[#FF6B6B] text-white font-black border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
            >
              SUBSCRIBE →
            </motion.button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row justify-between items-center gap-4">
          <motion.p 
            whileHover={{ scale: 1.05 }}
            className="font-black text-lg bg-[#FFD93D] px-4 py-2 border-4 border-black"
          >
            © {currentYear} POKECHAIN
          </motion.p>
          <div className="flex flex-wrap gap-4">
            {['PRIVACY POLICY', 'TERMS OF SERVICE'].map((text) => (
              <motion.a
                key={text}
                whileHover={{ rotate: -2, scale: 1.05 }}
                href="#"
                className="px-4 py-2 bg-[#4ECDC4] font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
              >
                {text}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;