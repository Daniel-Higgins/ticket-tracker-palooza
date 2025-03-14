
import { Team } from "@/lib/types";

// S3 bucket base URL
const S3_BUCKET_URL = "https://hsw-logo-bucket.s3.us-east-2.amazonaws.com/mlb/";

// MLB teams data with updated S3 logo paths
export const mlbTeams: Team[] = [
  {
    id: "11",
    name: "Arizona Diamondbacks",
    shortName: "D-backs",
    city: "Arizona",
    logo: `${S3_BUCKET_URL}arizona-diamondbacks.png`,
    primaryColor: "#A71930",
    secondaryColor: "#E3D4AD"
  },
  {
    id: "1",
    name: "Atlanta Braves",
    shortName: "Braves",
    city: "Atlanta",
    logo: `${S3_BUCKET_URL}Atlanta-Braves-Emblem.png`,
    primaryColor: "#CE1141",
    secondaryColor: "#13274F"
  },
  {
    id: "16",
    name: "Baltimore Orioles",
    shortName: "Orioles",
    city: "Baltimore",
    logo: `${S3_BUCKET_URL}baltimore-orioles.png`,
    primaryColor: "#DF4601",
    secondaryColor: "#000000"
  },
  {
    id: "17",
    name: "Boston Red Sox",
    shortName: "Red Sox",
    city: "Boston",
    logo: `${S3_BUCKET_URL}Boston-Red-Sox.png`,
    primaryColor: "#BD3039",
    secondaryColor: "#0C2340"
  },
  {
    id: "6",
    name: "Chicago Cubs",
    shortName: "Cubs",
    city: "Chicago",
    logo: `${S3_BUCKET_URL}chicago-cubs.png`,
    primaryColor: "#0E3386",
    secondaryColor: "#CC3433"
  },
  {
    id: "21",
    name: "Chicago White Sox",
    shortName: "White Sox",
    city: "Chicago",
    logo: `${S3_BUCKET_URL}chicago-white-sox.png`,
    primaryColor: "#27251F",
    secondaryColor: "#C4CED4"
  },
  {
    id: "7",
    name: "Cincinnati Reds",
    shortName: "Reds",
    city: "Cincinnati",
    logo: `${S3_BUCKET_URL}cincinnati-reds.png`,
    primaryColor: "#C6011F",
    secondaryColor: "#000000"
  },
  {
    id: "22",
    name: "Cleveland Guardians",
    shortName: "Guardians",
    city: "Cleveland",
    logo: `${S3_BUCKET_URL}cleveland-guardians.png`,
    primaryColor: "#00385D",
    secondaryColor: "#E50022"
  },
  {
    id: "12",
    name: "Colorado Rockies",
    shortName: "Rockies",
    city: "Colorado",
    logo: `${S3_BUCKET_URL}colorado-rockies.png`,
    primaryColor: "#33006F",
    secondaryColor: "#C4CED4"
  },
  {
    id: "23",
    name: "Detroit Tigers",
    shortName: "Tigers",
    city: "Detroit",
    logo: `${S3_BUCKET_URL}detroit-tigers.png`,
    primaryColor: "#0C2340",
    secondaryColor: "#FA4616"
  },
  {
    id: "26",
    name: "Houston Astros",
    shortName: "Astros",
    city: "Houston",
    logo: `${S3_BUCKET_URL}Houston-Astros-Logo.png`,
    primaryColor: "#002D62",
    secondaryColor: "#EB6E1F"
  },
  {
    id: "24",
    name: "Kansas City Royals",
    shortName: "Royals",
    city: "Kansas City",
    logo: `${S3_BUCKET_URL}Kansas-City-Royals.png`,
    primaryColor: "#004687",
    secondaryColor: "#BD9B60"
  },
  {
    id: "27",
    name: "Los Angeles Angels",
    shortName: "Angels",
    city: "Los Angeles",
    logo: `${S3_BUCKET_URL}los-angeles-angels.png`,
    primaryColor: "#BA0021",
    secondaryColor: "#003263"
  },
  {
    id: "13",
    name: "Los Angeles Dodgers",
    shortName: "Dodgers",
    city: "Los Angeles",
    logo: `${S3_BUCKET_URL}los-angeles-dodgers.png`,
    primaryColor: "#005A9C",
    secondaryColor: "#A5ACAF"
  },
  {
    id: "2",
    name: "Miami Marlins",
    shortName: "Marlins",
    city: "Miami",
    logo: `${S3_BUCKET_URL}miami-marlins.png`,
    primaryColor: "#00A3E0",
    secondaryColor: "#EF3340"
  },
  {
    id: "8",
    name: "Milwaukee Brewers",
    shortName: "Brewers",
    city: "Milwaukee",
    logo: `${S3_BUCKET_URL}milwaukee-brewers-logo.png`,
    primaryColor: "#0A2351",
    secondaryColor: "#B6922E"
  },
  {
    id: "25",
    name: "Minnesota Twins",
    shortName: "Twins",
    city: "Minnesota",
    logo: `${S3_BUCKET_URL}Minnesota-Twins.png`,
    primaryColor: "#002B5C",
    secondaryColor: "#D31145"
  },
  {
    id: "3",
    name: "New York Mets",
    shortName: "Mets",
    city: "New York",
    logo: `${S3_BUCKET_URL}New-York-Mets.png`,
    primaryColor: "#002D72",
    secondaryColor: "#FF5910"
  },
  {
    id: "18",
    name: "New York Yankees",
    shortName: "Yankees",
    city: "New York",
    logo: `${S3_BUCKET_URL}new-york-yankees.png`,
    primaryColor: "#0C2340",
    secondaryColor: "#C4CED3"
  },
  {
    id: "28",
    name: "Oakland Athletics",
    shortName: "Athletics",
    city: "Oakland",
    logo: `${S3_BUCKET_URL}Oakland-Athletics-Logo.png`,
    primaryColor: "#003831",
    secondaryColor: "#EFB21E"
  },
  {
    id: "4",
    name: "Philadelphia Phillies",
    shortName: "Phillies",
    city: "Philadelphia",
    logo: `${S3_BUCKET_URL}Philadelphia-Phillies-Logo.png`,
    primaryColor: "#E81828",
    secondaryColor: "#002D72"
  },
  {
    id: "9",
    name: "Pittsburgh Pirates",
    shortName: "Pirates",
    city: "Pittsburgh",
    logo: `${S3_BUCKET_URL}pittsburgh-pirates-logo.png`,
    primaryColor: "#27251F",
    secondaryColor: "#FDB827"
  },
  {
    id: "14",
    name: "San Diego Padres",
    shortName: "Padres",
    city: "San Diego",
    logo: `${S3_BUCKET_URL}san-diego-padres-logo.png`,
    primaryColor: "#2F241D",
    secondaryColor: "#FFC425"
  },
  {
    id: "15",
    name: "San Francisco Giants",
    shortName: "Giants",
    city: "San Francisco",
    logo: `${S3_BUCKET_URL}san-francisco-giants-logo.png`,
    primaryColor: "#FD5A1E",
    secondaryColor: "#27251F"
  },
  {
    id: "29",
    name: "Seattle Mariners",
    shortName: "Mariners",
    city: "Seattle",
    logo: `${S3_BUCKET_URL}Seattle-Mariners.png`,
    primaryColor: "#0C2C56",
    secondaryColor: "#005C5C"
  },
  {
    id: "10",
    name: "St. Louis Cardinals",
    shortName: "Cardinals",
    city: "St. Louis",
    logo: `${S3_BUCKET_URL}st-louis-cardinals-logo.png`,
    primaryColor: "#C41E3A",
    secondaryColor: "#0C2340"
  },
  {
    id: "19",
    name: "Tampa Bay Rays",
    shortName: "Rays",
    city: "Tampa Bay",
    logo: `${S3_BUCKET_URL}tampa-bay-rays-logo.png`,
    primaryColor: "#092C5C",
    secondaryColor: "#8FBCE6"
  },
  {
    id: "30",
    name: "Texas Rangers",
    shortName: "Rangers",
    city: "Texas",
    logo: `${S3_BUCKET_URL}texas-rangers-logo.png`,
    primaryColor: "#003278",
    secondaryColor: "#C0111F"
  },
  {
    id: "20",
    name: "Toronto Blue Jays",
    shortName: "Blue Jays",
    city: "Toronto",
    logo: `${S3_BUCKET_URL}toronto-blue-jays-logo.png`,
    primaryColor: "#134A8E",
    secondaryColor: "#E8291C"
  },
  {
    id: "5",
    name: "Washington Nationals",
    shortName: "Nationals",
    city: "Washington",
    logo: `${S3_BUCKET_URL}Washington-Nationals-Logo.png`,
    primaryColor: "#AB0003",
    secondaryColor: "#14225A"
  }
];
