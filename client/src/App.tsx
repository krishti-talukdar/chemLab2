import React, { Suspense, lazy } from "react";
import { lazy, Suspense } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Experiment from "@/pages/experiment";
import NotFound from "@/pages/not-found";
import TitrationResultsPage from "@/pages/titration-results";
import About from "@/pages/about";

function Router() {
  const Detection = lazy(() => import("@/pages/detection"));
  const Subscription = lazy(() => import("@/pages/subscription"));

  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/experiment/:id/results" component={TitrationResultsPage} />
        <Route path="/experiment/:id" component={Experiment} />
        <Route path="/about" component={About} />
        <Route path="/detection" component={Detection} />
        <Route path="/subscription" component={Subscription} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
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
