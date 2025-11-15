import logo from "./logo.png";
import { Zap, Mail, Network, Telescope, UserRound } from "lucide-react";
import left_bottom from "./one.jpg";
import left_top1 from "./four.jpg";
import top_right from "./three.jpg";
import right_bottom from "./five.jpg";
import right_bottom1 from "./six.jpg";
import left_top2 from "./seven.jpg";
import default_profile from "./default.jpg";

export const assets = {
  logo,
  left_bottom,
  left_top1,
  top_right,
  right_bottom,
  right_bottom1,
  left_top2,
  default_profile,
};

export const menuItemsData = [
  { to: "/", label: "Feed", Icon: Zap },
  { to: "/messages", label: "Messages", Icon: Mail },
  { to: "/connections", label: "Connections", Icon: Network },
  { to: "/discover", label: "Discover", Icon: Telescope },
  { to: "/profile", label: "Profile", Icon: UserRound },
];
