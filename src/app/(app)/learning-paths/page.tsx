
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MOCK_LEARNING_PATHS } from "@/lib/mock-data";
import type { LearningPath as LearningPathType, LearningPathNode as LearningPathNodeType } from "@/types";
import { ArrowRight, Check, Lock, MapPinned, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const learningPaths: LearningPathType[] = MOCK_LEARNING_PATHS;

// Recursive function to render nodes
const renderPathNode = (node: LearningPathNodeType, allNodes: LearningPathNodeType[], depth = 0): JSX.Element => {
  // Mock completion status for demo
  const isCompleted = Math.random() > 0.7; 
  const children = node.childrenNodeIds?.map(childId => allNodes.find(n => n.id === childId)).filter(Boolean) as LearningPathNodeType[];

  return (
    <div key={node.id} className={`ml-${depth * 4} mb-4`}>
      <Card className={`overflow-hidden transition-all duration-300 ${node.isUnlocked ? 'opacity-100 shadow-md' : 'opacity-60 bg-muted/30'}`}>
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <div className="flex items-center gap-3">
            {node.isUnlocked ? (isCompleted ? <Check className="h-6 w-6 text-green-500 shrink-0" /> : <Play className="h-6 w-6 text-primary shrink-0" />) : <Lock className="h-6 w-6 text-muted-foreground shrink-0" />}
            <div>
              <CardTitle className={`text-lg ${!node.isUnlocked && 'text-muted-foreground'}`}>{node.label}</CardTitle>
              {node.description && <CardDescription className="text-xs">{node.description}</CardDescription>}
            </div>
          </div>
          {node.isUnlocked && node.resourceId && (
             <Button size="sm" variant="outline" asChild>
               <Link href={node.type === 'course' ? `/courses/${node.resourceId}` : '#'}>
                 {isCompleted ? 'Review' : 'Start'} <ArrowRight className="ml-1 h-4 w-4" />
               </Link>
             </Button>
          )}
        </CardHeader>
      </Card>
      {children && children.length > 0 && (
        <div className={`pl-6 border-l-2 ${node.isUnlocked ? 'border-primary/50' : 'border-muted'} ml-3 mt-1`}>
          {children.map(childNode => renderPathNode(childNode, allNodes, depth + 1))}
        </div>
      )}
    </div>
  );
};


export default function LearningPathsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2"><MapPinned className="h-8 w-8 text-primary"/> Learning Paths</h1>
        <p className="text-muted-foreground">
          Follow curated paths to achieve your learning goals, unlocking new content as you progress.
        </p>
      </div>

      {learningPaths.length > 0 ? (
        <div className="space-y-10">
          {learningPaths.map((path) => (
            <Card key={path.id} className="shadow-xl overflow-hidden">
              <CardHeader className="bg-card p-0">
                {path.imageUrl && (
                  <Image src={path.imageUrl} alt={path.title} width={800} height={200} className="w-full h-40 object-cover" data-ai-hint={`${path.title.toLowerCase().split(" ").slice(0,2).join(" ")} path visual`} />
                )}
                <div className="p-6">
                  <CardTitle className="text-2xl">{path.title}</CardTitle>
                  <CardDescription>{path.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {path.nodes.filter(n => !n.parentId).map(rootNode => renderPathNode(rootNode, path.nodes))}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center">
             <Image src="https://placehold.co/300x200/F3F4F6/6B7280.png?text=No+Paths+Yet" alt="No learning paths" width={300} height={200} className="mx-auto mb-4 rounded-md" data-ai-hint="empty state illustration" />
            <p className="text-muted-foreground text-lg">No learning paths available yet. Stay tuned!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

    