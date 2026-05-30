import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import { STATUS_COLORS } from '../../utils/constants';

const columns = [
  { id: 'Pending', title: 'Pending', emoji: '📋' },
  { id: 'In Progress', title: 'In Progress', emoji: '🔄' },
  { id: 'Completed', title: 'Completed', emoji: '✅' },
];

const KanbanBoard = ({ tasks, onDragEnd, onEdit, onDelete, onStatusChange }) => {
  const getColumnTasks = (status) =>
    tasks
      .filter((t) => t.status === status)
      .sort((a, b) => a.order - b.order);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 min-h-[60vh]">
        {columns.map((column) => {
          const columnTasks = getColumnTasks(column.id);
          const statusColor = STATUS_COLORS[column.id];

          return (
            <div key={column.id} className="flex flex-col">
              {/* Column header */}
              <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{column.emoji}</span>
                  <h3 className="font-semibold text-surface-800 dark:text-surface-200">
                    {column.title}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColor.bg} ${statusColor.text}`}>
                    {columnTasks.length}
                  </span>
                </div>
              </div>

              {/* Droppable area */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`
                      flex-1 space-y-3 p-3 rounded-2xl transition-colors duration-200 min-h-[200px]
                      ${snapshot.isDraggingOver
                        ? 'bg-primary-50/50 dark:bg-primary-900/10 border-2 border-dashed border-primary-300 dark:border-primary-700'
                        : 'bg-surface-100/50 dark:bg-surface-800/30 border-2 border-transparent'
                      }
                    `}
                  >
                    {columnTasks.map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                          >
                            <TaskCard
                              task={task}
                              onEdit={onEdit}
                              onDelete={onDelete}
                              onStatusChange={onStatusChange}
                              isDragging={snapshot.isDragging}
                              dragHandleProps={provided.dragHandleProps}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    {columnTasks.length === 0 && !snapshot.isDraggingOver && (
                      <div className="flex flex-col items-center justify-center py-12 text-surface-400 dark:text-surface-500">
                        <p className="text-sm">No tasks</p>
                        <p className="text-xs mt-1">Drag tasks here</p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
