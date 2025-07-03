import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

export const Footer = () => {
    return (
        <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <Mail className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">MessageCraft</span>
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <Link to="/conditions" className="hover:text-foreground">Conditions d'utilisation</Link>
              <a href="#" className="hover:text-foreground">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    )
}