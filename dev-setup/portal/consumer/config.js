var config = {
    // Development features
    showQuery: false,
    title: "Portal - Consumer",
    theme: {
        light: {
            palette: {
                primary: { main: "#0043ce" },
                secondary: { main: "#1D49B8" },
                background: { default: "#ffffff" },
                text: {
                    primary: "#544f5a",
                    secondary: "#89868D"
                }
            },
            logo: {
                sx: {
                    height: 40,
                    width: 40,
                    mask: "url(/borlabs-cookie-icon-dynamic.svg) no-repeat center / contain",
                    backgroundColor: "#0043ce"
                }
            }
        },
        dark: {
            palette: {
                primary: { main: "#9055fd" },
                secondary: { main: "#FF83F6" },
                background: { default: "#110e1c", paper: "#151221" }
            },
            logo: {
                sx: {
                    height: 40,
                    width: 40,
                    mask: "url(/borlabs-cookie-icon-dynamic.svg) no-repeat center / contain",
                    backgroundColor: "#9055fd"
                }
            }
        }
    }
}