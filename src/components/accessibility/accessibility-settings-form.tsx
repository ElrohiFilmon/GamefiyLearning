
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import type { AccessibilitySettings } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Save, RotateCcw, Loader2 } from 'lucide-react';

const defaultSettings: AccessibilitySettings = {
  fontSize: 'medium',
  contrastMode: 'default',
  reduceMotion: false,
  dyslexiaFriendlyFont: false,
};

export function AccessibilitySettingsForm() {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const email = localStorage.getItem('currentUserEmail');
    setCurrentUserEmail(email);
    if (email) {
      const storedSettings = localStorage.getItem(`accessibilitySettings_${email}`);
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      } else {
        setSettings(defaultSettings); // Ensure defaults if no settings found for user
      }
    } else {
      // Handle case where no user is logged in, perhaps disable form or use global defaults
      // For now, using component defaults.
      setSettings(defaultSettings);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!currentUserEmail || isLoading) return;

    const storedSettings = localStorage.getItem(`accessibilitySettings_${currentUserEmail}`);
    const initialSettings = storedSettings ? JSON.parse(storedSettings) : defaultSettings;
    setHasChanges(JSON.stringify(settings) !== JSON.stringify(initialSettings));
  }, [settings, currentUserEmail, isLoading]);


  const handleSettingChange = (key: keyof AccessibilitySettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const applySettingsToDOM = (newSettings: AccessibilitySettings) => {
    document.documentElement.style.setProperty('--font-scale-factor', 
      newSettings.fontSize === 'small' ? '0.9' : newSettings.fontSize === 'large' ? '1.1' : '1'
    );
    
    document.body.classList.toggle('high-contrast', newSettings.contrastMode === 'high');
    document.body.classList.toggle('default-contrast', newSettings.contrastMode !== 'high');
    
    document.body.classList.toggle('reduce-motion', newSettings.reduceMotion);
    document.body.classList.toggle('dyslexia-font', newSettings.dyslexiaFriendlyFont);
  };


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentUserEmail) {
      toast({ title: "Error", description: "No user logged in to save settings.", variant: "destructive"});
      return;
    }
    localStorage.setItem(`accessibilitySettings_${currentUserEmail}`, JSON.stringify(settings));
    applySettingsToDOM(settings);
    setHasChanges(false);
    toast({
      title: "Settings Saved",
      description: "Your accessibility preferences have been updated.",
    });
  };

  const handleReset = () => {
    if (!currentUserEmail) {
       toast({ title: "Error", description: "No user logged in to reset settings.", variant: "destructive"});
      return;
    }
    setSettings(defaultSettings);
    localStorage.setItem(`accessibilitySettings_${currentUserEmail}`, JSON.stringify(defaultSettings));
    applySettingsToDOM(defaultSettings);
    setHasChanges(false);
     toast({
      title: "Settings Reset",
      description: "Accessibility preferences have been reset to default.",
    });
  }

  useEffect(() => {
    // Apply settings on initial load after fetching from localStorage
    if (!isLoading && currentUserEmail) {
      const storedSettings = localStorage.getItem(`accessibilitySettings_${currentUserEmail}`);
      applySettingsToDOM(storedSettings ? JSON.parse(storedSettings) : defaultSettings);
    } else if (!isLoading && !currentUserEmail) {
      // Apply default if no user logged in
      applySettingsToDOM(defaultSettings);
    }
  }, [isLoading, currentUserEmail]);


  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Accessibility Settings</CardTitle>
          <CardDescription>Customize your learning experience for better accessibility.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">Loading settings...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle>Accessibility Settings</CardTitle>
        <CardDescription>Customize your learning experience for better accessibility.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-8">
          {/* Font Size */}
          <div className="space-y-2">
            <Label className="text-base">Font Size</Label>
            <RadioGroup
              value={settings.fontSize}
              onValueChange={(value: 'small' | 'medium' | 'large') => handleSettingChange('fontSize', value)}
              className="flex space-x-4"
              disabled={!currentUserEmail}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="small" id="fs-small" />
                <Label htmlFor="fs-small">Small</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="fs-medium" />
                <Label htmlFor="fs-medium">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="large" id="fs-large" />
                <Label htmlFor="fs-large">Large</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Contrast Mode */}
          <div className="space-y-2">
            <Label className="text-base">Contrast Mode</Label>
            <RadioGroup
              value={settings.contrastMode}
              onValueChange={(value: 'default' | 'high') => handleSettingChange('contrastMode', value)}
              className="flex space-x-4"
              disabled={!currentUserEmail}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="default" id="cm-default" />
                <Label htmlFor="cm-default">Default</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="cm-high" />
                <Label htmlFor="cm-high">High Contrast</Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* Reduce Motion */}
          <div className="flex items-center justify-between space-x-2 p-3 border rounded-md">
            <Label htmlFor="reduce-motion" className="text-base flex-grow">
              Reduce Motion
              <p className="text-sm text-muted-foreground font-normal">Minimize animations and transitions.</p>
            </Label>
            <Switch
              id="reduce-motion"
              checked={settings.reduceMotion}
              onCheckedChange={(checked) => handleSettingChange('reduceMotion', checked)}
              aria-label="Toggle reduce motion"
              disabled={!currentUserEmail}
            />
          </div>

          {/* Dyslexia-Friendly Font */}
          <div className="flex items-center justify-between space-x-2 p-3 border rounded-md">
            <Label htmlFor="dyslexia-font" className="text-base flex-grow">
              Dyslexia-Friendly Font
              <p className="text-sm text-muted-foreground font-normal">Use a font designed for easier reading.</p>
            </Label>
            <Switch
              id="dyslexia-font"
              checked={settings.dyslexiaFriendlyFont}
              onCheckedChange={(checked) => handleSettingChange('dyslexiaFriendlyFont', checked)}
              aria-label="Toggle dyslexia-friendly font"
              disabled={!currentUserEmail}
            />
          </div>
          {!currentUserEmail && <p className="text-sm text-destructive text-center">Please log in to modify accessibility settings.</p>}
        </CardContent>
        <div className="p-6 flex justify-end gap-4 border-t">
            <Button type="button" variant="outline" onClick={handleReset} disabled={!currentUserEmail || (!hasChanges && JSON.stringify(settings) === JSON.stringify(defaultSettings))}>
                <RotateCcw className="mr-2 h-4 w-4"/> Reset to Default
            </Button>
            <Button type="submit" disabled={!currentUserEmail || !hasChanges}>
                <Save className="mr-2 h-4 w-4"/> Save Changes
            </Button>
        </div>
      </form>
    </Card>
  );
}

    