import { NodeProps } from "@xyflow/react";
import { BaseTriggerNode } from "../base-trigger-node";
import { memo, useState, useCallback } from "react";
import { useParams } from "next/navigation";

import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import GoogleFormSetupSheet from "./setup-guide";

const NGROK_URL = process.env.NEXT_PUBLIC_NGROK_URL;

const GoogleFormTriggerNode = memo((props: NodeProps) => {
  const { status } = useNodeStatus({ nodeId: props.id });
  const [showSetup, setShowSetup] = useState(false);
  const params = useParams<{ workflowId: string }>();

  const baseUrl = NGROK_URL || window.location.origin;
  const webhookUrl = `${baseUrl}/api/webhooks/google-form?workflowId=${params.workflowId}`;

  const handleSettings = useCallback(() => {
    setShowSetup(true);
  }, []);

  return (
    <div>
      <BaseTriggerNode
        {...props}
        name="Google Form Trigger"
        icon="/assets/icons/google-form.svg"
        iconBg="bg-zinc-100/80"
        status={status ?? "initial"}
        onSettings={handleSettings}
        onDoubleClick={handleSettings}
      >
        <GoogleFormSetupSheet
          open={showSetup}
          onOpenChange={setShowSetup}
          webhookUrl={webhookUrl}
        />
      </BaseTriggerNode>
    </div>
  );
});

GoogleFormTriggerNode.displayName = "GoogleFormTriggerNode";

export default GoogleFormTriggerNode;
