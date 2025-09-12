import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Experiment from "@/pages/experiment";
import NotFound from "@/pages/not-found";
import { Route as WRoute, Switch } from "wouter";

function Router() {
  return (
    <Switch>
      <WRoute path="/" component={Home} />
      <WRoute path="/experiment/:id" component={Experiment} />
      <WRoute component={NotFound} />
    </Switch>
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
