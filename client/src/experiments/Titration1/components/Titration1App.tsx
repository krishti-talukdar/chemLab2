import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Beaker, Calculator, CheckCircle } from "lucide-react";
import WorkspaceEquipment from './WorkspaceEquipment';
import { TITRATION_STEPS, TITRATION_FORMULAS } from '../constants';
import type { ExperimentState } from '../types';

const Titration1App: React.FC = () => {
  const [experimentState, setExperimentState] = useState<ExperimentState>({
    currentStep: 1,
    isSetupComplete: false,
    buretteReading: 0,
    endpointReached: false,
    titrationData: []
  });

  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('workspace');

  const handleEquipmentSelect = (equipmentId: string) => {
    setSelectedEquipment(prev => 
      prev.includes(equipmentId) 
        ? prev.filter(id => id !== equipmentId)
        : [...prev, equipmentId]
    );
  };

  const handleStepComplete = () => {
    if (experimentState.currentStep < TITRATION_STEPS.length) {
      setExperimentState(prev => ({
        ...prev,
        currentStep: prev.currentStep + 1
      }));
    }
  };

  const progressPercentage = (experimentState.currentStep / TITRATION_STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Titration 1: NaOH Standardization
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Determine the strength of NaOH solution using 0.1N oxalic acid standard
              </p>
            </div>
            <Badge variant="secondary" className="text-sm">
              Step {experimentState.currentStep} of {TITRATION_STEPS.length}
            </Badge>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="workspace" className="flex items-center gap-2">
              <Beaker className="w-4 h-4" />
              Workspace
            </TabsTrigger>
            <TabsTrigger value="procedure" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Procedure
            </TabsTrigger>
            <TabsTrigger value="calculations" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Calculations
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Results
            </TabsTrigger>
          </TabsList>

          {/* Workspace Tab */}
          <TabsContent value="workspace" className="space-y-6">
            <WorkspaceEquipment 
              onEquipmentSelect={handleEquipmentSelect}
              selectedEquipment={selectedEquipment}
            />
          </TabsContent>

          {/* Procedure Tab */}
          <TabsContent value="procedure" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Experimental Procedure</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Follow these steps carefully for accurate titration results
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {TITRATION_STEPS.map((step, index) => (
                    <div
                      key={step.id}
                      className={`flex items-start gap-4 p-4 rounded-lg border transition-all duration-200 ${
                        experimentState.currentStep === step.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                          : experimentState.currentStep > step.id
                          ? 'border-green-500 bg-green-50 dark:bg-green-950'
                          : 'border-gray-200'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          experimentState.currentStep === step.id
                            ? 'bg-blue-500 text-white'
                            : experimentState.currentStep > step.id
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {experimentState.currentStep > step.id ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          step.id
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{step.title}</h4>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                        {experimentState.currentStep === step.id && (
                          <Button 
                            size="sm" 
                            className="mt-3"
                            onClick={handleStepComplete}
                          >
                            Mark as Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calculations Tab */}
          <TabsContent value="calculations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Key Formulas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {TITRATION_FORMULAS.map((formula, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">{formula.name}</h4>
                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded font-mono text-sm mb-2">
                          {formula.formula}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formula.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sample Calculation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <h4 className="font-medium mb-3">Given:</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Volume of oxalic acid (V₁) = 25.0 mL</li>
                        <li>• Normality of oxalic acid (N₁) = 0.1 N</li>
                        <li>• Volume of NaOH used (V₂) = ? mL</li>
                        <li>• Normality of NaOH (N₂) = ? N</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <h4 className="font-medium mb-3">Calculation:</h4>
                      <div className="text-sm space-y-2">
                        <p>Using N₁V₁ = N₂V₂</p>
                        <p>0.1 × 25.0 = N₂ × V₂</p>
                        <p>N₂ = 2.5 / V₂</p>
                        <p>Strength = N₂ × 40 g/L</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Experimental Results</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Record your titration data and calculate the final results
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Beaker className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    Complete the titration to view results
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your experimental data and calculations will appear here once you complete the procedure
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Titration1App;
