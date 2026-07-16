import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ScrollManageTab from './ScrollManageTab'
import RecommendationManageTab from './RecommendationManageTab'

export default function ScrollAndRecommendManageTab() {
  return (
    <Tabs defaultValue="scroll-list">
      <TabsList className="w-full max-w-md grid grid-cols-2">
        <TabsTrigger value="scroll-list">密卷大全</TabsTrigger>
        <TabsTrigger value="recommendations">忍者密卷适配</TabsTrigger>
      </TabsList>
      <TabsContent value="scroll-list" className="mt-6">
        <ScrollManageTab />
      </TabsContent>
      <TabsContent value="recommendations" className="mt-6">
        <RecommendationManageTab />
      </TabsContent>
    </Tabs>
  )
}