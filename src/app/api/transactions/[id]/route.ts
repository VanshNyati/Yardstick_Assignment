import { NextRequest, NextResponse } from 'next/server';
import { updateTransaction } from '@/actions/transactions';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { description, amount, date, category } = body;

    if (!description || !amount || !date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await updateTransaction(params.id, {
      description,
      amount,
      date,
      category
    });

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to update transaction' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 