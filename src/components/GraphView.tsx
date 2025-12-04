import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface GraphNode {
  id: string;
  label: string;
  group: string;
}

interface GraphEdge {
  from: string;
  to: string;
}

interface GraphViewProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export function GraphView({ nodes, edges }: GraphViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const container = containerRef.current;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    container.appendChild(canvas);

    const nodePositions = new Map<string, { x: number; y: number; vx: number; vy: number }>();
    
    nodes.forEach((node, i) => {
      const angle = (i / nodes.length) * Math.PI * 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.3;
      nodePositions.set(node.id, {
        x: canvas.width / 2 + Math.cos(angle) * radius,
        y: canvas.height / 2 + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
      });
    });

    let isDragging = false;
    let draggedNode: string | null = null;
    let animationFrame: number;

    const getNodeAtPosition = (x: number, y: number): string | null => {
      for (const [id, pos] of nodePositions.entries()) {
        const dx = x - pos.x;
        const dy = y - pos.y;
        if (Math.sqrt(dx * dx + dy * dy) < 30) {
          return id;
        }
      }
      return null;
    };

    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const node = getNodeAtPosition(x, y);
      if (node) {
        isDragging = true;
        draggedNode = node;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && draggedNode) {
        const rect = canvas.getBoundingClientRect();
        const pos = nodePositions.get(draggedNode);
        if (pos) {
          pos.x = e.clientX - rect.left;
          pos.y = e.clientY - rect.top;
          pos.vx = 0;
          pos.vy = 0;
        }
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
      draggedNode = null;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);

    const isDark = document.documentElement.classList.contains('dark');
    const primaryColor = isDark ? '#6366f1' : '#4f46e5';
    const textColor = isDark ? '#f8fafc' : '#0f172a';
    const edgeColor = isDark ? '#475569' : '#cbd5e1';

    const simulate = () => {
      edges.forEach((edge) => {
        const source = nodePositions.get(edge.from);
        const target = nodePositions.get(edge.to);
        if (!source || !target) return;

        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const force = (distance - 150) * 0.01;

        source.vx += (dx / distance) * force;
        source.vy += (dy / distance) * force;
        target.vx -= (dx / distance) * force;
        target.vy -= (dy / distance) * force;
      });

      nodePositions.forEach((pos, id) => {
        if (draggedNode === id) return;

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const dx = cx - pos.x;
        const dy = cy - pos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const force = distance * 0.001;

        pos.vx += (dx / distance) * force;
        pos.vy += (dy / distance) * force;

        pos.vx *= 0.9;
        pos.vy *= 0.9;

        pos.x += pos.vx;
        pos.y += pos.vy;

        const padding = 30;
        pos.x = Math.max(padding, Math.min(canvas.width - padding, pos.x));
        pos.y = Math.max(padding, Math.min(canvas.height - padding, pos.y));
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = edgeColor;
      ctx.lineWidth = 2;
      edges.forEach((edge) => {
        const source = nodePositions.get(edge.from);
        const target = nodePositions.get(edge.to);
        if (!source || !target) return;

        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
      });

      nodes.forEach((node) => {
        const pos = nodePositions.get(node.id);
        if (!pos) return;

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 25, 0, Math.PI * 2);
        ctx.fillStyle = primaryColor;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = textColor;
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const maxWidth = 100;
        const label = node.label.length > 15 ? node.label.slice(0, 15) + '...' : node.label;
        ctx.fillText(label, pos.x, pos.y + 40);
      });

      simulate();
      animationFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animationFrame);
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }, [nodes, edges]);

  return (
    <motion.div
      ref={containerRef}
      className="w-full h-[600px] bg-[rgb(var(--color-bg-subtle))] rounded-xl border border-[rgb(var(--color-border))] overflow-hidden relative"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute top-4 left-4 bg-[rgb(var(--color-bg-base))] px-4 py-2 rounded-lg shadow-lg text-sm">
        <p className="text-[rgb(var(--color-text-muted))]">
          <span className="font-semibold">{nodes.length}</span> nodes •{' '}
          <span className="font-semibold">{edges.length}</span> connections
        </p>
        <p className="text-xs text-[rgb(var(--color-text-muted))] mt-1">
          Drag nodes to explore
        </p>
      </div>
    </motion.div>
  );
}
