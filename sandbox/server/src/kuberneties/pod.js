import { k8sCoreV1Api } from "./config.js";

export async function createPod(sandboxId) {
  const podManifest = {
    apiVersion: "v1",
    kind: "Pod",
    metadata: {
      name: `sandbox-pod-${sandboxId}`,
      labels: {
        app: "sandbox",
        sandboxId: sandboxId,
      },
    },
    spec: {
      volumes:[
        {
          name: "workspace_volume",
          emptyDir:{}
        }
      ],
      containers: [
        {
          name: "sandbox-container",
          image: "template",
          imagePullPolicy: "IfNotPresent",
          ports: [
            {
              containerPort: 5173,
              name: "http",
            },
          ],
          resources: {
            limits: {
              cpu: "500m",
              memory: "1Gi",
            },
            requests: {
              cpu: "250m",
              memory: "500Mi",
            },
            volumeMounts: [
              {
                name: "workspace_volume",
                mountPath: "/workspace"
              }
            ]
          },
        },
        {
          name: "agent-container",
          image: "agent",
          imagePullPolicy: "IfNotPresent",
          ports: [{
            containerPort: 3000,
            name: "http",
          }],
          resources: {
            limits: {
              cpu: "500m",
              memory: "1Gi",
            },
            requests: {
              cpu: "250m",
              memory: "500Mi",
            },
            volumeMounts: [
              {
                name: "workspace_volume",
                mountPath: "/workspace"
              }
            ]
          }
        }
      ],
    },
  };

  const response = await k8sCoreV1Api.createNamespacedPod({
    namespace: "default",
    body: podManifest,
  });

  return response;
}