import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Main from "./pages/Main";
import Faq from "./pages/Faq";
import Profile from "./pages/Profile";
import DetailsPage from "./pages/DetailsPage";

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
                path: "faq",
                element: <Faq/>
            },
            {
                path: "profile",
                element: <Profile/>
            },
            {
                path: "details",
                element: <DetailsPage/>
            }
        ]
    }
])

export default myRouter