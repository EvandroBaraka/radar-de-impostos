import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./router-tree-gen";
import { AuthProvider } from "./contexts/AuthContext/AuthProvider";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
    interface RegisterRouter {
        router: typeof router;
    }
}

function App() {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    );
}

export default App;
