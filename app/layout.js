import { Inter } from "next/font/google";
import "@/styles/globals.css";
import ThemeRegistry from "./theme-registry";

const inter = Inter({ subsets: ["latin"] });

const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE;
const isOffseason = process.env.NEXT_PUBLIC_OFFSEASON;
const isHiatus = process.env.NEXT_PUBLIC_SEASON_HIATUS;

//CHANGE THIS TO REFLECT THE PREV YEAR
const offSeasonYear = 2024;

export const metadata = {
  title: "744 Survey",
  description: "[FIRST FRC Team 744] Match and Pit Survey App",
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  }
};

export const viewport = {
  colorScheme: 'dark',
}

export default function RootLayout({ children }) {
  return (
    <ThemeRegistry  options={{ key: 'joy' }}>
    <html lang="en">
      <body className={inter.className}>
        <div className="dev-mode-container">
          {isDevMode && (isDevMode == "true") &&
            <div className="dev-mode-box">Dev Mode Enabled</div>
          }
          {isOffseason && (isOffseason == "true") &&
            <div className="dev-mode-box">PostSeason Mode Enabled ({offSeasonYear})</div>
          }
          {isHiatus && (isHiatus == "true") &&
            <div className="dev-mode-box">Hiatus Mode Enabled</div>
          }
        </div>

        {children}
      </body>
    </html>
    </ThemeRegistry>
  );
}