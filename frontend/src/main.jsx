import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./index.css"
import { BrowserRouter } from "react-router-dom"
import ThemeProvider from "./context/ThemeProvider.jsx"
import NotificationProvider from "./context/NotificationProvider.jsx"
import AuthProvider from "./context/AuthProvider.jsx"
import SearchProvider from "./context/SearchProvider.jsx"


ReactDOM.createRoot(document.getElementById("root")).render(
	<BrowserRouter>
		<NotificationProvider>
			<SearchProvider>
				<AuthProvider>
					<ThemeProvider>
						<App />
					</ThemeProvider>
				</AuthProvider>
			</SearchProvider>
		</NotificationProvider>
	</BrowserRouter>,
)
