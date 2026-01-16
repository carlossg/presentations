# Argo Rollouts AI Metric Plugin - Feedback Loop Diagram

## Option 1: Compact Horizontal Flow
```mermaid
graph LR
    A[Source Code] --> B[Deploy]
    B --> C[Canary]
    C --> D[Analysis]
    D --> E{Result}
    E -->|Success| F[Promote]
    E -->|Failure| G[Issue]
    G --> H[Copilot]
    H --> I[PR]
    I --> J[Code]
    J --> A
    F --> K[Production]
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#fff3e0
    style D fill:#e8f5e8
    style E fill:#fff9c4
    style F fill:#e8f5e8
    style G fill:#ffebee
    style H fill:#fce4ec
    style I fill:#f3e5f5
    style J fill:#e1f5fe
    style K fill:#c8e6c9
```

## Option 2: Two-Row Layout (Modified)
```mermaid
graph LR
    subgraph "Main Flow"
        A[Source Code] --> B[Deploy]
        B --> C[Canary]
        C --> D[Analysis]
        D --> E{AI Analysis Result}
    end
    
    subgraph "Success Path"
        E -->|Success| F[Promote Canary]
        F --> G[Production]
    end
    
    subgraph "Failure Path"
        E -->|Failure| H[Rollback Canary]
        H --> I[Create GitHub Issue]
        I --> J[Assign to Copilot]
        J --> K[Generate Pull Request]
        K --> L[Code Changes]
        L --> A
    end
    
    style A fill:#4FC3F7,stroke:#0277BD,stroke-width:3px,color:#000
    style B fill:#BA68C8,stroke:#7B1FA2,stroke-width:3px,color:#000
    style C fill:#FFB74D,stroke:#F57C00,stroke-width:3px,color:#000
    style D fill:#81C784,stroke:#388E3C,stroke-width:3px,color:#000
    style E fill:#FFF176,stroke:#F9A825,stroke-width:3px,color:#000
    style F fill:#A5D6A7,stroke:#4CAF50,stroke-width:3px,color:#000
    style G fill:#66BB6A,stroke:#2E7D32,stroke-width:3px,color:#000
    style H fill:#FF8A65,stroke:#D84315,stroke-width:3px,color:#000
    style I fill:#EF5350,stroke:#C62828,stroke-width:3px,color:#fff
    style J fill:#F48FB1,stroke:#AD1457,stroke-width:3px,color:#000
    style K fill:#90CAF9,stroke:#1976D2,stroke-width:3px,color:#000
    style L fill:#B39DDB,stroke:#512DA8,stroke-width:3px,color:#000
```

## Option 3: Compact with Subgraphs
```mermaid
graph LR
    subgraph "Deployment"
        A[Source] --> B[Deploy] --> C[Canary]
    end
    
    subgraph "Analysis"
        C --> D[AI Analysis] --> E{Result}
    end
    
    subgraph "Success"
        E -->|Success| F[Promote] --> G[Production]
    end
    
    subgraph "Remediation"
        E -->|Failure| H[Issue] --> I[Copilot] --> J[PR] --> K[Code]
    end
    
    K --> A
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#fff3e0
    style D fill:#e8f5e8
    style E fill:#fff9c4
    style F fill:#e8f5e8
    style G fill:#c8e6c9
    style H fill:#ffebee
    style I fill:#fce4ec
    style J fill:#f3e5f5
    style K fill:#e1f5fe
```

## Option 4: Minimalist Flow
```mermaid
graph LR
    A[Code] --> B[Deploy] --> C[Canary] --> D[Analyze] --> E{Result}
    E -->|Success| F[Promote] --> G[Production]
    E -->|Failure| H[Issue] --> I[Copilot] --> J[PR] --> K[Fix] --> A
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#fff3e0
    style D fill:#e8f5e8
    style E fill:#fff9c4
    style F fill:#e8f5e8
    style G fill:#c8e6c9
    style H fill:#ffebee
    style I fill:#fce4ec
    style J fill:#f3e5f5
    style K fill:#e1f5fe
```

## Option 5: Wide Format with Groups
```mermaid
graph LR
    subgraph "Development Cycle"
        A[Source Code] --> B[Deploy] --> C[Canary]
    end
    
    subgraph "AI Analysis"
        C --> D[Analysis] --> E{AI Result}
    end
    
    subgraph "Success Path"
        E -->|Success| F[Promote] --> G[Production]
    end
    
    subgraph "Automated Remediation"
        E -->|Failure| H[GitHub Issue] --> I[Assign Copilot] --> J[Generate PR] --> K[Code Changes]
    end
    
    K --> A
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#fff3e0
    style D fill:#e8f5e8
    style E fill:#fff9c4
    style F fill:#e8f5e8
    style G fill:#c8e6c9
    style H fill:#ffebee
    style I fill:#fce4ec
    style J fill:#f3e5f5
    style K fill:#e1f5fe
```

## Feedback Loop Phases

1. **Source Code** - Initial codebase with application changes
2. **Deploy** - Deployment to Kubernetes cluster
3. **Canary** - Canary deployment with traffic splitting
4. **Analysis** - AI-powered analysis of canary vs stable behavior
5. **Failure** - AI detects issues in canary deployment
6. **Create GitHub Issue** - Automated issue creation with analysis details
7. **Assign to Copilot** - Issue assigned to GitHub Copilot for automated resolution
8. **Generate Pull Request** - Copilot creates PR with fixes
9. **Code Changes** - Developer reviews and merges the PR
10. **Back to Source Code** - Cycle continues with improved code

## Key Components

- **AI Analysis**: Uses Gemini AI to analyze logs and metrics
- **Automated Issue Creation**: Creates GitHub issues with detailed analysis
- **Copilot Integration**: Assigns issues to GitHub Copilot for automated fixes
- **Feedback Loop**: Continuous improvement through automated remediation
