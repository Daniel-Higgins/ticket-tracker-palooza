
import { Team } from "@/lib/types";

// MLB teams data with S3 logo paths
export const mlbTeams: Team[] = [
  {
    id: "11",
    name: "Arizona Diamondbacks",
    shortName: "D-backs",
    city: "Arizona",
    logo: "https://s3.amazonaws.com/mlb-teams/arizona-diamondbacks.png",
    primaryColor: "#A71930",
    secondaryColor: "#E3D4AD"
  },
  {
    id: "1",
    name: "Atlanta Braves",
    shortName: "Braves",
    city: "Atlanta",
    logo: "https://s3.amazonaws.com/mlb-teams/atlanta-braves.png",
    primaryColor: "#CE1141",
    secondaryColor: "#13274F"
  },
  {
    id: "16",
    name: "Baltimore Orioles",
    shortName: "Orioles",
    city: "Baltimore",
    logo: "https://s3.amazonaws.com/mlb-teams/baltimore-orioles.png",
    primaryColor: "#DF4601",
    secondaryColor: "#000000"
  },
  {
    id: "17",
    name: "Boston Red Sox",
    shortName: "Red Sox",
    city: "Boston",
    logo: "https://s3.amazonaws.com/mlb-teams/boston-red-sox.png",
    primaryColor: "#BD3039",
    secondaryColor: "#0C2340"
  },
  {
    id: "6",
    name: "Chicago Cubs",
    shortName: "Cubs",
    city: "Chicago",
    logo: "https://s3.amazonaws.com/mlb-teams/chicago-cubs.png",
    primaryColor: "#0E3386",
    secondaryColor: "#CC3433"
  },
  {
    id: "21",
    name: "Chicago White Sox",
    shortName: "White Sox",
    city: "Chicago",
    logo: "https://s3.amazonaws.com/mlb-teams/chicago-white-sox.png",
    primaryColor: "#27251F",
    secondaryColor: "#C4CED4"
  },
  {
    id: "7",
    name: "Cincinnati Reds",
    shortName: "Reds",
    city: "Cincinnati",
    logo: "https://s3.amazonaws.com/mlb-teams/cincinnati-reds.png",
    primaryColor: "#C6011F",
    secondaryColor: "#000000"
  },
  {
    id: "22",
    name: "Cleveland Guardians",
    shortName: "Guardians",
    city: "Cleveland",
    logo: "https://s3.amazonaws.com/mlb-teams/cleveland-guardians.png",
    primaryColor: "#00385D",
    secondaryColor: "#E50022"
  },
  {
    id: "12",
    name: "Colorado Rockies",
    shortName: "Rockies",
    city: "Colorado",
    logo: "https://s3.amazonaws.com/mlb-teams/colorado-rockies.png",
    primaryColor: "#33006F",
    secondaryColor: "#C4CED4"
  },
  {
    id: "23",
    name: "Detroit Tigers",
    shortName: "Tigers",
    city: "Detroit",
    logo: "https://s3.amazonaws.com/mlb-teams/detroit-tigers.png",
    primaryColor: "#0C2340",
    secondaryColor: "#FA4616"
  },
  {
    id: "26",
    name: "Houston Astros",
    shortName: "Astros",
    city: "Houston",
    logo: "https://s3.amazonaws.com/mlb-teams/houston-astros.png",
    primaryColor: "#002D62",
    secondaryColor: "#EB6E1F"
  },
  {
    id: "24",
    name: "Kansas City Royals",
    shortName: "Royals",
    city: "Kansas City",
    logo: "https://s3.amazonaws.com/mlb-teams/kansas-city-royals.png",
    primaryColor: "#004687",
    secondaryColor: "#BD9B60"
  },
  {
    id: "27",
    name: "Los Angeles Angels",
    shortName: "Angels",
    city: "Los Angeles",
    logo: "https://s3.amazonaws.com/mlb-teams/los-angeles-angels.png",
    primaryColor: "#BA0021",
    secondaryColor: "#003263"
  },
  {
    id: "13",
    name: "Los Angeles Dodgers",
    shortName: "Dodgers",
    city: "Los Angeles",
    logo: "https://s3.amazonaws.com/mlb-teams/los-angeles-dodgers.png",
    primaryColor: "#005A9C",
    secondaryColor: "#A5ACAF"
  },
  {
    id: "2",
    name: "Miami Marlins",
    shortName: "Marlins",
    city: "Miami",
    logo: "https://s3.amazonaws.com/mlb-teams/miami-marlins.png",
    primaryColor: "#00A3E0",
    secondaryColor: "#EF3340"
  },
  {
    id: "8",
    name: "Milwaukee Brewers",
    shortName: "Brewers",
    city: "Milwaukee",
    logo: "https://s3.amazonaws.com/mlb-teams/milwaukee-brewers.png",
    primaryColor: "#0A2351",
    secondaryColor: "#B6922E"
  },
  {
    id: "25",
    name: "Minnesota Twins",
    shortName: "Twins",
    city: "Minnesota",
    logo: "https://s3.amazonaws.com/mlb-teams/minnesota-twins.png",
    primaryColor: "#002B5C",
    secondaryColor: "#D31145"
  },
  {
    id: "3",
    name: "New York Mets",
    shortName: "Mets",
    city: "New York",
    logo: "https://s3.amazonaws.com/mlb-teams/new-york-mets.png",
    primaryColor: "#002D72",
    secondaryColor: "#FF5910"
  },
  {
    id: "18",
    name: "New York Yankees",
    shortName: "Yankees",
    city: "New York",
    logo: "https://s3.amazonaws.com/mlb-teams/new-york-yankees.png",
    primaryColor: "#0C2340",
    secondaryColor: "#C4CED3"
  },
  {
    id: "28",
    name: "Oakland Athletics",
    shortName: "Athletics",
    city: "Oakland",
    logo: "https://s3.amazonaws.com/mlb-teams/oakland-athletics.png",
    primaryColor: "#003831",
    secondaryColor: "#EFB21E"
  },
  {
    id: "4",
    name: "Philadelphia Phillies",
    shortName: "Phillies",
    city: "Philadelphia",
    logo: "https://s3.amazonaws.com/mlb-teams/philadelphia-phillies.png",
    primaryColor: "#E81828",
    secondaryColor: "#002D72"
  },
  {
    id: "9",
    name: "Pittsburgh Pirates",
    shortName: "Pirates",
    city: "Pittsburgh",
    logo: "https://s3.amazonaws.com/mlb-teams/pittsburgh-pirates.png",
    primaryColor: "#27251F",
    secondaryColor: "#FDB827"
  },
  {
    id: "14",
    name: "San Diego Padres",
    shortName: "Padres",
    city: "San Diego",
    logo: "https://s3.amazonaws.com/mlb-teams/san-diego-padres.png",
    primaryColor: "#2F241D",
    secondaryColor: "#FFC425"
  },
  {
    id: "15",
    name: "San Francisco Giants",
    shortName: "Giants",
    city: "San Francisco",
    logo: "https://s3.amazonaws.com/mlb-teams/san-francisco-giants.png",
    primaryColor: "#FD5A1E",
    secondaryColor: "#27251F"
  },
  {
    id: "29",
    name: "Seattle Mariners",
    shortName: "Mariners",
    city: "Seattle",
    logo: "https://s3.amazonaws.com/mlb-teams/seattle-mariners.png",
    primaryColor: "#0C2C56",
    secondaryColor: "#005C5C"
  },
  {
    id: "10",
    name: "St. Louis Cardinals",
    shortName: "Cardinals",
    city: "St. Louis",
    logo: "https://s3.amazonaws.com/mlb-teams/st-louis-cardinals.png",
    primaryColor: "#C41E3A",
    secondaryColor: "#0C2340"
  },
  {
    id: "19",
    name: "Tampa Bay Rays",
    shortName: "Rays",
    city: "Tampa Bay",
    logo: "https://s3.amazonaws.com/mlb-teams/tampa-bay-rays.png",
    primaryColor: "#092C5C",
    secondaryColor: "#8FBCE6"
  },
  {
    id: "30",
    name: "Texas Rangers",
    shortName: "Rangers",
    city: "Texas",
    logo: "https://s3.amazonaws.com/mlb-teams/texas-rangers.png",
    primaryColor: "#003278",
    secondaryColor: "#C0111F"
  },
  {
    id: "20",
    name: "Toronto Blue Jays",
    shortName: "Blue Jays",
    city: "Toronto",
    logo: "https://s3.amazonaws.com/mlb-teams/toronto-blue-jays.png",
    primaryColor: "#134A8E",
    secondaryColor: "#E8291C"
  },
  {
    id: "5",
    name: "Washington Nationals",
    shortName: "Nationals",
    city: "Washington",
    logo: "https://s3.amazonaws.com/mlb-teams/washington-nationals.png",
    primaryColor: "#AB0003",
    secondaryColor: "#14225A"
  }
];
