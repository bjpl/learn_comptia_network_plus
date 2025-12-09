import { useState } from 'react';
import type { IaCTemplate } from '../../modern-types';
import type { IaCTab, IaCLanguage, SampleCode } from '../types';
import { generateTemplateCode } from '../utils';

const SAMPLE_CODE: SampleCode = {
  yaml: `---
# Ansible Playbook Example
- name: Configure Network Devices
  hosts: routers
  gather_facts: no

  tasks:
    - name: Set hostname
      cisco.ios.ios_config:
        lines:
          - hostname {{ inventory_hostname }}

    - name: Configure interfaces
      cisco.ios.ios_interfaces:
        config:
          - name: GigabitEthernet0/1
            description: Uplink to Core
            enabled: true
        state: merged

    - name: Save configuration
      cisco.ios.ios_config:
        save_when: changed`,

  json: `{
  "variables": {
    "hostname": {
      "type": "string",
      "description": "Device hostname",
      "required": true
    },
    "management_ip": {
      "type": "string",
      "description": "Management interface IP"
    }
  },
  "tasks": [
    {
      "name": "Configure hostname",
      "module": "ios_config",
      "parameters": {
        "lines": ["hostname {{ hostname }}"]
      }
    },
    {
      "name": "Configure management interface",
      "module": "ios_interface",
      "parameters": {
        "name": "GigabitEthernet0/0",
        "ipv4": "{{ management_ip }}"
      }
    }
  ]
}`,

  hcl: `# Terraform Configuration Example
variable "vpc_cidr" {
  type        = string
  description = "VPC CIDR block"
  default     = "10.0.0.0/16"
}

resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "main-vpc"
    Environment = "production"
  }
}

resource "aws_subnet" "public" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, count.index)
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "public-subnet-\${count.index + 1}"
  }
}`,
};

export const useIaCBuilder = () => {
  const [activeTab, setActiveTab] = useState<IaCTab>('concepts');
  const [selectedTemplate, setSelectedTemplate] = useState<IaCTemplate | null>(null);
  const [codeEditorContent, setCodeEditorContent] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<IaCLanguage>('yaml');
  const [showValidation, setShowValidation] = useState(false);

  const handleTemplateSelect = (template: IaCTemplate) => {
    setSelectedTemplate(template);
    setCodeEditorContent(generateTemplateCode(template));
  };

  const handleLanguageChange = (lang: IaCLanguage) => {
    setSelectedLanguage(lang);
    setCodeEditorContent(SAMPLE_CODE[lang]);
  };

  return {
    activeTab,
    setActiveTab,
    selectedTemplate,
    setSelectedTemplate,
    codeEditorContent,
    setCodeEditorContent,
    selectedLanguage,
    setSelectedLanguage,
    showValidation,
    setShowValidation,
    handleTemplateSelect,
    handleLanguageChange,
    sampleCode: SAMPLE_CODE,
  };
};
