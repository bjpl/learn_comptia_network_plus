/**
 * Styles component for TrafficTypeDemo
 */

import React from 'react';

export const DemoStyles: React.FC = () => {
  return (
    <style>{`
      .traffic-type-demo {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        border-radius: 8px;
      }

      .traffic-type-demo:focus {
        outline: 2px solid #3b82f6;
        outline-offset: 4px;
      }

      .demo-header {
        text-align: center;
        margin-bottom: 30px;
      }

      .demo-header h2 {
        color: #2c3e50;
        font-size: 32px;
      }

      .subtitle {
        color: #7f8c8d;
        font-style: italic;
      }

      .demo-container {
        background: white;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        padding: 30px;
      }

      .traffic-selector {
        margin-bottom: 30px;
      }

      .traffic-selector h3 {
        color: #2c3e50;
        margin-bottom: 15px;
      }

      .traffic-buttons {
        display: flex;
        gap: 15px;
        flex-wrap: wrap;
      }

      .traffic-btn {
        padding: 12px 25px;
        background: white;
        border: 3px solid #bdc3c7;
        border-radius: 8px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s;
      }

      .traffic-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      }

      .traffic-btn.active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-color: #764ba2;
      }

      .network-canvas-container {
        position: relative;
        margin: 30px 0;
        text-align: center;
      }

      .network-canvas {
        border: 2px solid #ecf0f1;
        border-radius: 8px;
        background: #f8f9fa;
        max-width: 100%;
      }

      .animation-controls {
        margin: 20px 0;
        display: flex;
        justify-content: center;
        gap: 15px;
      }

      .control-btn {
        padding: 12px 30px;
        border: none;
        border-radius: 5px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s;
      }

      .control-btn.start {
        background: #2ecc71;
        color: white;
      }

      .control-btn.start:hover {
        background: #27ae60;
      }

      .control-btn.reset {
        background: #e74c3c;
        color: white;
      }

      .control-btn.reset:hover {
        background: #c0392b;
      }

      .legend {
        display: flex;
        justify-content: center;
        gap: 30px;
        margin-top: 20px;
        padding: 15px;
        background: #ecf0f1;
        border-radius: 5px;
      }

      .legend-item {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .legend-dot {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid #2c3e50;
      }

      .legend-dot.source {
        background: #e74c3c;
      }

      .legend-dot.destination {
        background: #2ecc71;
      }

      .legend-dot.normal {
        background: #3498db;
      }

      .traffic-info {
        margin: 30px 0;
        padding: 25px;
        background: #f8f9fa;
        border-radius: 8px;
        border-left: 5px solid #3498db;
      }

      .traffic-info h3 {
        color: #2c3e50;
        font-size: 24px;
        margin-bottom: 15px;
      }

      .description {
        font-size: 16px;
        line-height: 1.6;
        color: #34495e;
        margin-bottom: 20px;
      }

      .characteristics, .use-cases {
        margin: 20px 0;
      }

      .characteristics h4, .use-cases h4, .example h4 {
        color: #2c3e50;
        margin-bottom: 10px;
      }

      .characteristics ul, .use-cases ul {
        list-style-position: inside;
        line-height: 1.8;
        color: #34495e;
      }

      .example {
        margin-top: 20px;
        padding: 15px;
        background: white;
        border-radius: 5px;
        border: 2px solid #3498db;
      }

      .example p {
        font-style: italic;
        color: #34495e;
      }

      .explanation-section {
        margin: 30px 0;
        padding: 25px;
        background: #e8f5e9;
        border-radius: 8px;
      }

      .explanation-section h3 {
        color: #27ae60;
        margin-bottom: 15px;
      }

      .explanation-section textarea {
        width: 100%;
        padding: 15px;
        border: 2px solid #27ae60;
        border-radius: 5px;
        font-size: 16px;
        font-family: inherit;
        resize: vertical;
      }

      .word-count {
        margin-top: 10px;
        text-align: right;
        color: #7f8c8d;
        font-weight: bold;
      }

      .comparison-section {
        margin-top: 30px;
      }

      .comparison-btn {
        width: 100%;
        padding: 15px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 18px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s;
      }

      .comparison-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      }

      .comparison-table {
        margin-top: 25px;
        animation: slideDown 0.5s ease;
      }

      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 30px;
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }

      th {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px;
        text-align: left;
        font-weight: bold;
      }

      td {
        padding: 12px 15px;
        border-bottom: 1px solid #ecf0f1;
      }

      tbody tr:hover {
        background: #f8f9fa;
      }

      .when-to-use {
        margin-top: 30px;
      }

      .when-to-use h4 {
        color: #2c3e50;
        font-size: 20px;
        margin-bottom: 20px;
      }

      .use-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
      }

      .use-card {
        padding: 20px;
        background: white;
        border-radius: 8px;
        border-left: 5px solid #3498db;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        transition: transform 0.3s;
      }

      .use-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      }

      .use-card h5 {
        color: #2c3e50;
        margin-bottom: 10px;
        font-size: 18px;
      }

      .use-card p {
        color: #34495e;
        line-height: 1.6;
      }

      .use-card:nth-child(1) {
        border-left-color: #9b59b6;
      }

      .use-card:nth-child(2) {
        border-left-color: #e67e22;
      }

      .use-card:nth-child(3) {
        border-left-color: #16a085;
      }

      .use-card:nth-child(4) {
        border-left-color: #c0392b;
      }

      @media (max-width: 768px) {
        .network-canvas {
          width: 100%;
          height: auto;
        }

        .traffic-buttons {
          flex-direction: column;
        }

        .traffic-btn {
          width: 100%;
        }

        .legend {
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
        }

        .use-grid {
          grid-template-columns: 1fr;
        }
      }
    `}</style>
  );
};
