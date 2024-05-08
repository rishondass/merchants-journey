import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
	    },
      fontFamily:{
        "papyrus": ["Papyrus", "serif"]
      },
      colors:{
        "bgGray": "#EEEEEE"
      },
      dropShadow:{
        "whiteBr":[
          '2px  0px 0px white',
          '-2px  0px 0px white',
          '0px  2px 0px white',
          '0px -2px 0px white'
        ],
        'indigoBr':[
          '2px  0px 0px #6366f1',
          '-2px  0px 0px #6366f1',
          '0px  2px 0px #6366f1',
          '0px -2px 0px #6366f1'
        ]
      }

    },
  },
  plugins: [],
};
export default config;
