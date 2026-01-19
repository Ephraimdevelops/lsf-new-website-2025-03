import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Power, RefreshCw, DollarSign, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const OpsDashboard = () => {
    const { toast } = useToast();

    // Fetch Ops Data
    const budget = useQuery(api.ops.getBudgetStatus);
    const staleDocs = useQuery(api.ops.listStaleDocuments);
    const systemStatus = useQuery(api.ops.getSystemStatus);
    const toggleStatus = useMutation(api.ops.toggleSystemStatus);

    const handleKillSwitch = async () => {
        try {
            const newStatus = await toggleStatus();
            toast({
                title: "System Status Updated",
                description: `System is now ${newStatus.toUpperCase()}`,
                variant: newStatus === 'active' ? 'default' : 'destructive',
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to toggle system status. Check permissions.",
                variant: "destructive"
            });
        }
    };

    if (!budget || !staleDocs || !systemStatus) {
        return <div className="p-4 flex gap-2"><RefreshCw className="animate-spin" /> Loading Mission Control...</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

            {/* 1. BUDGET HEALTH */}
            <Card className={`border-l-4 ${budget.isLocked ? 'border-l-red-500 bg-red-50' : 'border-l-green-500'}`}>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold uppercase text-gray-500 flex items-center justify-between">
                        Budget Health
                        <DollarSign className="h-4 w-4" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2">
                        {budget.isLocked ? (
                            <AlertTriangle className="h-8 w-8 text-red-600" />
                        ) : (
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        )}
                        <div>
                            <p className={`text-2xl font-bold ${budget.isLocked ? 'text-red-700' : 'text-green-700'}`}>
                                {budget.isLocked ? 'LOCKED' : 'Active'}
                            </p>
                            <p className="text-sm text-gray-600">
                                ${budget.usage.toFixed(2)} / ${budget.limit.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 2. KILL SWITCH */}
            <Card className={`border-l-4 ${systemStatus.isMaintenance ? 'border-l-red-500 bg-red-100' : 'border-l-gray-300'}`}>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold uppercase text-gray-500 flex items-center justify-between">
                        SARA AI Status
                        <Power className="h-4 w-4" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <span className={`font-bold ${systemStatus.isMaintenance ? 'text-red-600' : 'text-green-600'}`}>
                                {systemStatus.isMaintenance ? 'MAINTENANCE MODE' : 'OPERATIONAL'}
                            </span>
                        </div>
                        <Button
                            variant={systemStatus.isMaintenance ? "default" : "destructive"}
                            onClick={handleKillSwitch}
                            className="w-full font-bold"
                        >
                            {systemStatus.isMaintenance ? "RESTORE SYSTEM (Go Live)" : "KILL SWITCH (Emergency Stop)"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* 3. CONTENT FRESHNESS */}
            <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold uppercase text-gray-500 flex items-center justify-between">
                        Stale Documents ({staleDocs.length})
                        <FileText className="h-4 w-4" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {staleDocs.length === 0 ? (
                        <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-5 w-5" />
                            <span className="text-sm font-medium">All content is fresh</span>
                        </div>
                    ) : (
                        <div className="max-h-24 overflow-y-auto space-y-2 pr-2">
                            {staleDocs.map(doc => (
                                <div key={doc._id} className="text-xs bg-white p-2 rounded border border-gray-100 shadow-sm flex justify-between items-center">
                                    <span className="truncate max-w-[120px]" title={doc.title}>{doc.title}</span>
                                    <span className="text-red-500 font-mono">{doc.daysSinceReview}d</span>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default OpsDashboard;
