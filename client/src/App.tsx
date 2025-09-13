import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Experiment from "@/pages/experiment";
import NotFound from "@/pages/not-found";
import * as Wouter from "wouter";

function Router() {
  return (
    <Wouter.Switch>
      <Wouter.Route path="/" component={Home} />
      <Wouter.Route path="/experiment/:id" component={Experiment} />
      <Wouter.Route component={NotFound} />
    </Wouter.Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
