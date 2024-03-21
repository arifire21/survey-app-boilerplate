import Image from "next/image";
import { Button } from '@mui/joy'
import styles from "./page.module.css";
import Logo from "../public/images/FIS_CRESCENDO_Logo_Horizontal_RGB.png";

export default function Home() {
  return (
    <>
    <header className={styles.flexHeader}>
      <p>Version: <span id="version-number" style={{color: '#01a0bb'}}>3.0.1-Orlando</span></p>
      <nav style={{display:'flex', flexDirection: 'column'}}>
        <Button component="a" href="/pit-results" sx={{mb:'0.5rem'}}>
          View Pit Results &#8594;
        </Button>
        <Button component="a" href="/match-results" sx={{mt:'0.5rem'}}>
          View Match Results &#8594;
        </Button>
      </nav>
    </header>

    <div id="game-logo-container">
    {/* <img src="./FIS_CRESCENDO_Logo_Horizontal_RGB.png" alt="FIRST Crescendo Logo" width="100%" height="100%"/> */}
      <div className={styles.gameLogoContainer}>
        <Image src={Logo} alt="FIRST Crescendo Logo" fill/>
      </div>
    </div>

    <div className={styles.menuContainer}>
        <h1>Select Survey Mode</h1>
        <nav className={styles.buttonContainer}>
        <Button component="a" href="/pit-survey">
          Pit Survey
        </Button>
        <Button component="a" href="/match-survey">
          Match Survey
        </Button>
        </nav>
    </div>
    </>
  );
}
