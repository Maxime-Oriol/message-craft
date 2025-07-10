import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth"


export const Header = () => {

    const { user } = useAuth()

    return (
        <header className="border-b">
            <div className="container mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
            <Link to="/" className="inline-flex items-center space-x-2">
                {/*<ArrowLeft className="w-4 h-4" />*/}
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-lg sm:text-xl font-bold hidden sm:inline">MessageCraft</span>
            </Link>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
                <Badge variant="outline" className="text-xs sm:text-sm px-2 sm:px-3">
                    <span className="sm:inline">user-id : {user.id}</span>
                {/*
                    <span className="hidden sm:inline">{getGenerationsLeft()} Crafts restants</span>
                    <span className="sm:hidden">{getGenerationsLeft()}</span>
                */}
                </Badge>
                {/* 
                {user ? (
                <Button variant="outline" size="sm" asChild>
                    <Link to="/profile">Profil</Link>
                </Button>
                ) : (
                <Button size="sm" asChild>
                    <Link to="/register">Créer un compte</Link>
                </Button>
                )}
                */}
            </div>
            
            </div>
        </header>
    );
};