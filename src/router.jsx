import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Main from "./pages/Main";
import Faq from "./pages/Faq";
import Profile from "./pages/Profile";
import DetailsPage from "./pages/DetailsPage";
import Dictionary from "./pages/Dictionary";
import Chat from "./pages/Chat";

const myRouter = createBrowserRouter([
    {
        path: "/",
        element: <Layout/>, 
        children: [
            {
                path: "",
                element: <Main/>
            },
            {
                path: "faqPage",
                element: <Faq/>
            },
            {
                path: "profile",
                element: <Profile/>
            },
            {
                path: "details",
                element: <DetailsPage/>
            },
            {
                path: "vocab",
                element: <Dictionary/>
            },
            {
                path: "chat",
                element: <Chat/>
            }
        ]
    }
])

export default myRouter