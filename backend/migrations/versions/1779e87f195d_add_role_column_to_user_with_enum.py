"""Add role column to User with ENUM

Revision ID: 1779e87f195d
Revises: 17200235c5c9
Create Date: 2025-06-29 14:15:30.681215
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '1779e87f195d'
down_revision = '17200235c5c9'
branch_labels = None
depends_on = None

# define ENUM explicitly
role_enum = sa.Enum('ADMIN', 'MEMBER', name='roleenum')

def upgrade():
    # 1. Create ENUM type before using it
    role_enum.create(op.get_bind(), checkfirst=True)

    # 2. Add the column using the ENUM type
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('role', role_enum, nullable=False, server_default='MEMBER'))

def downgrade():
    # 1. Drop the column first
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('role')

    # 2. Drop the ENUM type
    role_enum.drop(op.get_bind(), checkfirst=True)
