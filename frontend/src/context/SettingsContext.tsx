// src/context/SettingsContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "English" | "Spanish" | "French";
type Appearance = "Light" | "Dark";

interface SettingsContextType {
  appearance: Appearance;
  setAppearance: (theme: Appearance) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  English: {
    // Navigation & General
    settings: "Settings",
    general: "General",
    notifications: "Notifications",
    notifyWhen: "Notify me when..",
    docExpireSoon: "When a document is about to expire",
    docExpired: "When a document has expired",
    desktopNotif: "Desktop Notification",
    emailNotif: "Email Notification",
    inAppNotif: "In-App Notification",
    appearance: "Appearance",
    appearanceDesc: "Customize how your theme looks on your device",
    language: "Language",
    languageDesc: "Change your language preference",
    logout: "Logout",
    dashboard: "Dashboard",
    documents: "Documents",
    reminder: "Reminder",
    vehicles: "Vehicles",
    profile: "Profile",

    // Dashboard & Content
    welcomeUser: "Welcome User,",
    overviewSubtitle: "Here’s an overview of your vehicle documents.",
    totalVehicles: "Total Vehicles",
    validDocuments: "Valid Documents",
    expiringSoon: "Expiring Soon",
    expired: "Expired",
    myVehicles: "My Vehicles",
    viewAllVehicles: "View all vehicles >",
    noVehiclesYet: "You haven't added any vehicle yet.",
    addVehiclesPrompt: "Add your vehicles to start organizing and tracking.",
  },
  Spanish: {
    // Navigation & General
    settings: "Configuración",
    general: "General",
    notifications: "Notificaciones",
    notifyWhen: "Notificarme cuando..",
    docExpireSoon: "Cuando un documento está por expirar",
    docExpired: "Cuando un documento ha expirado",
    desktopNotif: "Notificación de escritorio",
    emailNotif: "Notificación por correo",
    inAppNotif: "Notificación en la aplicación",
    appearance: "Apariencia",
    appearanceDesc: "Personaliza cómo se ve el tema en tu dispositivo",
    language: "Idioma",
    languageDesc: "Cambia tu preferencia de idioma",
    logout: "Cerrar sesión",
    dashboard: "Tablero",
    documents: "Documentos",
    reminder: "Recordatorio",
    vehicles: "Vehículos",
    profile: "Perfil",

    // Dashboard & Content
    welcomeUser: "Bienvenido Usuario,",
    overviewSubtitle:
      "Aquí tienes un resumen de los documentos de tus vehículos.",
    totalVehicles: "Vehículos Totales",
    validDocuments: "Documentos Válidos",
    expiringSoon: "Por Expirar",
    expired: "Expirados",
    myVehicles: "Mis Vehículos",
    viewAllVehicles: "Ver todos los vehículos >",
    noVehiclesYet: "Aún no has agregado ningún vehículo.",
    addVehiclesPrompt:
      "Agrega tus vehículos para comenzar a organizar y rastrear.",
  },
  French: {
    // Navigation & General
    settings: "Paramètres",
    general: "Général",
    notifications: "Notifications",
    notifyWhen: "Me notifier lorsque..",
    docExpireSoon: "Lorsqu'un document est sur le point d'expirer",
    docExpired: "Lorsqu'un document a expiré",
    desktopNotif: "Notification bureau",
    emailNotif: "Notification par email",
    inAppNotif: "Notification intégrée",
    appearance: "Apparence",
    appearanceDesc: "Personnalisez l'apparence de votre thème",
    language: "Langue",
    languageDesc: "Modifiez votre préférence de langue",
    logout: "Se déconnecter",
    dashboard: "Tableau de bord",
    documents: "Documents",
    reminder: "Rappel",
    vehicles: "Véhicules",
    profile: "Profil",

    // Dashboard & Content
    welcomeUser: "Bienvenue Utilisateur,",
    overviewSubtitle: "Voici un aperçu des documents de vos véhicules.",
    totalVehicles: "Véhicules Totaux",
    validDocuments: "Documents Valides",
    expiringSoon: "Expirant Bientôt",
    expired: "Expirés",
    myVehicles: "Mes Véhicules",
    viewAllVehicles: "Afficher tous les véhicules >",
    noVehiclesYet: "Vous n'avez pas encore ajouté de véhicule.",
    addVehiclesPrompt:
      "Ajoutez vos véhicules pour commencer à organiser et suivre.",
  },
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [appearance, setAppearance] = useState<Appearance>("Light");
  const [language, setLanguage] = useState<Language>("English");

  useEffect(() => {
    if (appearance === "Dark") {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [appearance]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <SettingsContext.Provider
      value={{ appearance, setAppearance, language, setLanguage, t }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
